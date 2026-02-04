import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Memory } from '@mastra/memory';
import { convertCurrencyTool } from './fx-converter';
import { calculateOntarioTaxTool } from './tax-calculator';
import { Agent } from '@mastra/core/agent';
import { PostgresStore } from '@mastra/pg';
import { MastraCompositeStore } from '@mastra/core/storage';

export enum agent_models {
  GEMINI_2_MODEL = 'gemini-2.5-flash',
  GEMINI_3_MODEL = 'gemini-3-flash-preview',
}

const createAgentMemory = (mastraStore: PostgresStore, memoryTemplate: string) => {
  return new Memory({
    storage: mastraStore as MastraCompositeStore,
    options: {
      lastMessages: 10,
      workingMemory: {
        enabled: true,
        // The template acts as the structure the Agent will follow
        template: memoryTemplate,
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

const FINANCIAL_ADVISOR_INSTRUCTIONS = `
    You are a professional Ontario-based financial advisor.
    
    WORKING MEMORY:
    You have a "User Financial Profile" in your working memory. 
    1. Whenever the user shares a personal or financial detail, update the profile.
    2. Always check the profile before asking the user for information you should already know.
    3. Keep the Markdown structure consistent with the template.
` as const;

const FINANCIAL_ADVISOR_MEMORY_TEMPLATE = `
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
  const memory = createAgentMemory(mastraStore, FINANCIAL_ADVISOR_MEMORY_TEMPLATE);
  const model = getModel(modelName, apiKey);

  return new Agent({
    id,
    name,
    instructions: `${FINANCIAL_ADVISOR_INSTRUCTIONS} \n ${additionalInstructions}`,
    model,
    memory,
    tools: {
      calculateTax: calculateOntarioTaxTool,
      convertCurrency: convertCurrencyTool,
    },
  });
};

const FINANCE_ENTRY_EXTRACTION_INSTRUCTIONS = `
    You are an expert financial data extraction agent.
    
    TASK:
    Extract relevant financial entry data from user-provided documents with high accuracy.
    
    DATA FIELDS TO EXTRACT:
    - Date
    - Amount
    - Currency
    - Category
    - Description
    - Tax Year
    
    OUTPUT FORMAT:
    Return ONLY a valid JSON object. Do NOT wrap it in markdown code blocks.
    Do NOT include any text before or after the JSON.
    Do NOT use \`\`\`json or \`\`\` markers.
    
    JSON Structure:
    {
      "date": "YYYY-MM-DD",
      "amount": number,
      "currency": "3-letter code",
      "category": "string",
      "description": "string",
      "taxYear": number,
      "type": "INCOME" | "DEDUCTION" | "CREDIT" | "TAX_PAID"
    }
    
    IMPORTANT:
    - If any field is missing or unclear, use null as the value.
    - Convert all amounts to CAD currency.
    - Your entire response must be valid JSON that can be parsed directly.
    - Do not include explanations, emojis, or any other text outside the JSON.
` as const;

const FINANCE_ENTRY_EXTRACTION_MEMORY_TEMPLATE = `
  # Document Extraction Context
  - Document Type: 
  - User Notes:
  - Previous Extractions:
` as const;

export const createFinanceEntryExtractionAgent = ({
  mastraStore,
  modelName = agent_models.GEMINI_2_MODEL,
  apiKey,
  id,
  name,
  additionalInstructions = '',
}: {
  mastraStore?: PostgresStore;
  modelName?: agent_models;
  apiKey: string;
  id: string;
  name: string;
  additionalInstructions?: string;
}) => {
  const memory = mastraStore
    ? createAgentMemory(mastraStore, FINANCE_ENTRY_EXTRACTION_MEMORY_TEMPLATE)
    : undefined;
  const model = getModel(modelName, apiKey);

  return new Agent({
    id,
    name,
    instructions: `${FINANCE_ENTRY_EXTRACTION_INSTRUCTIONS} \n ${additionalInstructions}`,
    model,
    memory, // May not be needed for extraction tasks
    tools: {
      convertCurrency: convertCurrencyTool,
    },
  });
};
