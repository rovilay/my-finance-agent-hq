import { tool } from 'ai';
import { z } from 'zod';

const convertCurrencySchema = z.object({
  usdAmount: z.number().describe('The amount in USD to convert to CAD'),
});

type ConvertCurrencySchemaType = z.infer<typeof convertCurrencySchema>;
type ConvertCurrencyResult = {
  usdAmount: number;
  cadAmount: number;
  rate: number;
  date: string;
  provider: string;
};

const EXCHANGE_RATE_API_URL =
  'https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1';

const fetchExchangeRate = async (): Promise<{ rate: number; date: string; provider: string }> => {
  const response = await fetch(EXCHANGE_RATE_API_URL);
  const data = await response.json();
  /**
   * Valet API Structure: data.observations[0].FXUSDCAD.v
   * This represents how many CAD you get for 1 USD.
   */
  const observation = data.observations[0];
  const rate = parseFloat(observation.VFXUSDCAD.v);
  const date = observation.d;
  return { rate, date, provider: 'Bank of Canada' };
};

const convertCurrency = async ({
  usdAmount,
}: ConvertCurrencySchemaType): Promise<ConvertCurrencyResult> => {
  const { rate, date, provider } = await fetchExchangeRate();
  const cadAmount = usdAmount * rate;

  return {
    usdAmount,
    cadAmount: Number(cadAmount.toFixed(2)),
    rate: rate,
    date,
    provider,
  };
};

export const convertCurrencyTool = tool({
  description: 'Converts USD to CAD using the most recent Bank of Canada exchange rates.',
  inputSchema: convertCurrencySchema,
  execute: convertCurrency,
});
