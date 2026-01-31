import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Memory } from '@mastra/memory';
import { convertCurrencyTool } from './fx-converter';
import { calculateOntarioTaxTool } from './tax-calculator';
import { Agent } from '@mastra/core/agent';
import { PostgresStore } from '@mastra/pg';

export enum agent_models {
  GEMINI_2_MODEL = 'gemini-2.5-flash',
  GEMINI_3_MODEL = 'gemini-3-flash-preview',
}

const createAgentMemory = (mastraStore: PostgresStore) => {
  return new Memory({
    storage: mastraStore as any,
    options: {
      lastMessages: 10,
      workingMemory: {
        enabled: true,
        // The template acts as the structure the Agent will follow
        template: `
          # User Financial Profile
          ## Personal Details
          - Name: 
          - Location: [City, Province]

          ## Income & Tax
          - Annual Salary:
          - Tax Year:
          - Self-Employed/HHT Status:

          ## Financial Goals
          - Goal 1: 
          - Goal 2:
          ...
          `,
      },
    },
  });
};

const getModel = (modelName: agent_models, apiKey: string) => {
  const googleGenAI = createGoogleGenerativeAI({
    apiKey,
  });

  return googleGenAI(modelName);
};

const instructions = `
    You are a professional Ontario-based financial advisor.
    
    WORKING MEMORY:
    You have a "User Financial Profile" in your working memory. 
    1. Whenever the user shares a personal or financial detail, update the profile.
    2. Always check the profile before asking the user for information you should already know.
    3. Keep the Markdown structure consistent with the template.
  ` as const;

export const createFinanceAgent = ({
  mastraStore,
  modelName = agent_models.GEMINI_2_MODEL,
  apiKey,
  id,
  name,
  additionalInstructions = '',
}: {
  mastraStore: PostgresStore;
  modelName?: agent_models;
  apiKey: string;
  id: string;
  name: string;
  additionalInstructions?: string;
}) => {
  const memory = createAgentMemory(mastraStore);
  const model = getModel(modelName, apiKey);

  return new Agent({
    id,
    name,
    instructions: `${instructions} ${additionalInstructions}`,
    model,
    memory,
    tools: {
      calculateTax: calculateOntarioTaxTool,
      convertCurrency: convertCurrencyTool,
    },
  });
};
