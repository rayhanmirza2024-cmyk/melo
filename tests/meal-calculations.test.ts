import sample from '@/data/february-2026.json';
import { getMonthDays, monthLabel, toISODate } from '@/lib/dates';
import { getDailyCost, summarizeMonth } from '@/lib/meal-calculations';
import { describe, expect, it } from 'vitest';

describe('meal calculations', () => {
  it('matches the provided February 2026 sample totals', () => {
    const summary = summarizeMonth(sample.entries, sample.mealPrice);

    expect(summary.totalMeals).toBe(1);
    expect(summary.lunchCount).toBe(0);
    expect(summary.dinnerCount).toBe(1);
    expect(summary.daysInMonth).toBe(28);
    expect(summary.totalBill).toBe(50);

    const activeCosts = sample.entries.filter((entry) => getDailyCost(entry, sample.mealPrice) > 0);
    expect(activeCosts).toHaveLength(1);
    expect(activeCosts[0]?.date).toBe('2026-02-27');
    expect(getDailyCost(activeCosts[0]!, sample.mealPrice)).toBe(50);
  });

  it('generates accurate day counts and labels for leap and non-leap months', () => {
    expect(getMonthDays(2026, 2)).toHaveLength(28);
    expect(getMonthDays(2024, 2)).toHaveLength(29);
    expect(getMonthDays(2026, 4)).toHaveLength(30);
    expect(getMonthDays(2026, 1)).toHaveLength(31);

    const firstDay = toISODate(getMonthDays(2026, 2)[0]);
    expect(firstDay).toBe('2026-02-01');
    expect(monthLabel(2026, 2)).toBe('February 2026');
  });
});
