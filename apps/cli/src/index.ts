import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { stepCountIs, ToolLoopAgent } from 'ai';
import { aiEnv } from '@hq/config';
import { calculateOntarioTaxTool, convertCurrencyTool } from '@hq/tools';

import 'dotenv/config';

const googleGenAI = createGoogleGenerativeAI({
  apiKey: aiEnv.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = googleGenAI('gemini-3-flash-preview');

const financeAgent = new ToolLoopAgent({
  model,
  instructions: `You are a high-end Canadian financial advisor. 
                 Break down calculations for transparency. 
                 Use the available tools for currency and tax accuracy.`,
  tools: {
    calculateTax: calculateOntarioTaxTool,
    convertCurrency: convertCurrencyTool,
  },
  // Optional: Override the default 20 steps
  stopWhen: stepCountIs(10),
});

async function main() {
  console.log('🛠️  Agent: Finance HQ Initialized...');

  const { text, steps } = await financeAgent.generate({
    prompt:
      'I earned $279,000 CAD from a client. if that were my only income this year in Toronto, what would my take-home pay be?',
  });

  console.log('\n--- AGENT RESPONSE ---');
  console.log(text);

  console.log('\n--- THOUGHT PROCESS (STEPS) ---');
  steps.forEach((step, i) => {
    const stepInfo = step.text ? 'Text response' : 'Tool call';
    console.log(`Step ${i + 1}: ${stepInfo}`);
  });
}

main().catch(error => {
  console.error('🚨 Execution error:', error.message);
  process.exit(1);
});
