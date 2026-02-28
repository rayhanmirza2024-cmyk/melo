export type MealEntry = {
  date: string;
  lunch: boolean;
  dinner: boolean;
};

export type MonthMeals = {
  year: number;
  month: number;
  mealPrice: number;
  entries: MealEntry[];
};

export type MonthSummary = {
  lunchCount: number;
  dinnerCount: number;
  totalMeals: number;
  totalBill: number;
  daysInMonth: number;
};
