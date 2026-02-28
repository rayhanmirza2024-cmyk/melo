import { MealEntry } from './types';

export type EncodedState = {
  price: number;
  lunch: string[];
  dinner: string[];
};

export function encodeState(entries: MealEntry[], price: number): string {
  const payload: EncodedState = {
    price,
    lunch: entries.filter((e) => e.lunch).map((e) => e.date),
    dinner: entries.filter((e) => e.dinner).map((e) => e.date)
  };

  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeState(encoded: string | undefined): EncodedState | null {
  if (!encoded) return null;

  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as EncodedState;
    return {
      price: Number(parsed.price) || 50,
      lunch: Array.isArray(parsed.lunch) ? parsed.lunch : [],
      dinner: Array.isArray(parsed.dinner) ? parsed.dinner : []
    };
  } catch {
    return null;
  }
}
