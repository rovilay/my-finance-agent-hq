import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { aiEnv } from '@hq/config';
import { calculateOntarioTaxTool, convertCurrencyTool } from '@hq/tools';
import { mastraStore } from './db';
import { Memory } from '@mastra/memory';
import { Agent } from '@mastra/core/agent';

import 'dotenv/config';

// const GEMINI_3_MODEL = 'gemini-3-flash-preview';
const GEMINI_2_MODEL = 'gemini-2.5-flash';

const memory = new Memory({
  storage: mastraStore,
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
        `,
    },
  },
});

const googleGenAI = createGoogleGenerativeAI({
  apiKey: aiEnv.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = googleGenAI(GEMINI_2_MODEL);

const instructions = `
    You are a professional Ontario-based financial advisor.
    
    WORKING MEMORY:
    You have a "User Financial Profile" in your working memory. 
    1. Whenever the user shares a personal or financial detail, update the profile.
    2. Always check the profile before asking the user for information you should already know.
    3. Keep the Markdown structure consistent with the template.
  `;

const financeAgent = new Agent({
  id: 'my-finance-hq-agent',
  name: 'Finance HQ Agent',
  instructions,
  model,
  memory,
  tools: {
    calculateTax: calculateOntarioTaxTool,
    convertCurrency: convertCurrencyTool,
  },
});

async function main() {
  console.log('🛠️  Agent: Testing Mastra Memory Persistence...');

  // Identifiers that link this conversation to YOU and THIS specific chat
  const memoryContext = {
    thread: 'test-thread-002',
    resource: 'user-ogooluwa',
  };

  // --- TURN 1: Giving Information ---
  const turn1 = await financeAgent.generate(
    'Remind me, what are my current financial goals and where do I live?',
    {
      memory: memoryContext,
    }
  );
  console.log('Agent:', turn1.text);

  // // --- TURN 2: Recalling Information ---
  // console.log("\n[Turn 2] User: 'Based on what I just told you, what is my Ontario tax?'");
  // const turn2 = await financeAgent.generate(
  //   'Based on what I just told you, what is my Ontario tax?',
  //   {
  //     memory: memoryContext,
  //   }
  // );
  // console.log('Agent:', turn2.text);
}

main().catch(error => {
  console.error('🚨 Execution error:', error.message);
  process.exit(1);
});
