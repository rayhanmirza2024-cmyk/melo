import { MealEntry, MonthSummary } from './types';

export function getDailyCost(entry: MealEntry, mealPrice: number): number {
  const meals = Number(entry.lunch) + Number(entry.dinner);
  return meals * mealPrice;
}

export function summarizeMonth(entries: MealEntry[], mealPrice: number): MonthSummary {
  const lunchCount = entries.filter((entry) => entry.lunch).length;
  const dinnerCount = entries.filter((entry) => entry.dinner).length;
  const totalMeals = lunchCount + dinnerCount;

  return {
    lunchCount,
    dinnerCount,
    totalMeals,
    totalBill: totalMeals * mealPrice,
    daysInMonth: entries.length
  };
}

export function taka(value: number): string {
  return `৳${value}`;
}
