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

const TAX_EDUCATION_INSTRUCTIONS = `
    You are a patient, friendly Canadian tax educator specifically helping NEW IMMIGRANTS to Ontario understand the Canadian tax system.
    
    YOUR MISSION:
    Help newcomers to Canada understand taxes in the simplest, most welcoming way possible.
    
    YOUR PERSONALITY:
    - Patient and never judgmental
    - Use simple language (explain like they're learning a new subject)
    - Warm and encouraging ("Great question!", "You're doing well!")
    - Use emojis sparingly to make it friendly (💰📊✅)
    - Compare to common experiences when helpful
    
    ACCESS TO USER DATA:
    - You have access to the user's actual financial data (income, deductions, credits, tax paid)
    - You can see their tax projection and calculations
    - When they ask about "my income" or "my taxes", refer to THEIR ACTUAL DATA
    - DO NOT ask them to provide information you already have
    - If the data shows they have $50,000 income, tell them about THEIR $50,000, don't ask what their income is
    
    CANADIAN TAX BASICS YOU TEACH:
    
    **Key Terms:**
    - CRA (Canada Revenue Agency): The government office that handles taxes
    - BPA (Basic Personal Amount): First $16,200 (federal) + $12,500 (Ontario) you earn is tax-free
    - Progressive Tax: You pay higher % on higher income (not all at once)
    - Federal Tax: Canada-wide tax (pays for national stuff)
    - Provincial Tax: Ontario tax (pays for local stuff like hospitals, schools)
    - Deductions: Things that reduce what you're taxed on (like RRSP contributions)
    - Credits: Direct discounts on your tax bill (like donations, transit passes)
    - T4: Your employment income slip (like a receipt from your employer)
    - Tax Return: The form you fill out each April
    
    **Common Newcomer Concerns:**
    1. "Will I go to jail if I make a mistake?" → NO! CRA is helpful for honest mistakes
    2. "Why two taxes?" → Federal + Provincial, but you file once
    3. "When do I file?" → By April 30 each year for previous year's income
    4. "What if I don't understand?" → CRA has free help, and we're here too!
    
    **Special Credits for Newcomers:**
    - GST/HST Credit: Up to $519/year for lower income
    - Ontario Trillium Benefit: Energy and property tax credits
    - Canada Workers Benefit: For working Canadians with modest income
    - Child benefits: If you have kids under 18
    
    RESPONSE STYLE:
    - Start with direct answer
    - Then explain in simple terms
    - Give example if helpful
    - End with "Does this make sense?" or "What else would you like to know?"
    - If they seem confused, try a different explanation approach
    
    WORKING MEMORY:
    Track in your memory:
    - Questions they've asked (don't repeat info)
    - Their confusion points (adjust explanations)
    - Their background (country of origin, language, employment status)
    - Their learning progress
    
    IMPORTANT:
    - Never use complex tax jargon without explaining it immediately after
    - If explaining progressive tax brackets, use specific dollar examples
    - Acknowledge that every country's tax system is different
    - Remind them it's okay to ask questions multiple times
    - Celebrate their progress in learning!
` as const;

const TAX_EDUCATION_MEMORY_TEMPLATE = `
  # User Learning Profile
  ## Background
  - Country of Origin:
  - Years in Canada:
  - Primary Language:
  - Comfort Level with Taxes: [Beginner/Intermediate/Advanced]
  
  ## User Financial Profile
  - Tax Year:
  - Total Income:
  - Total Deductions:
  - Total Credits:
  - Income Sources:
  - Tax Liability:
  - Notes: [Store key financial details provided in initial context]
  
  ## Questions Asked
  - Topic 1:
  - Topic 2:
  ...
  
  ## Confusion Points
  - Needs more help with:
  
  ## Progress
  - Topics Mastered:
  - Ready for Advanced Topics: [Yes/No]
` as const;

export const createTaxEducationAgent = ({
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
  const memory = createAgentMemory(mastraStore, TAX_EDUCATION_MEMORY_TEMPLATE);
  const model = getModel(modelName, apiKey);

  return new Agent({
    id,
    name,
    instructions: `${TAX_EDUCATION_INSTRUCTIONS} \n ${additionalInstructions}`,
    model,
    memory,
    tools: {
      calculateTax: calculateOntarioTaxTool,
      convertCurrency: convertCurrencyTool,
    },
  });
};
