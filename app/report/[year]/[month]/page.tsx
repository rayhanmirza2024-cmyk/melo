import sampleData from '@/data/february-2026.json';
import { ReportDocument } from '@/components/report-document';
import { getMonthDays, toISODate } from '@/lib/dates';
import { decodeState } from '@/lib/report-state';
import { MealEntry } from '@/lib/types';

function buildFromState(year: number, month: number, encoded: string | undefined): { entries: MealEntry[]; mealPrice: number } {
  const decoded = decodeState(encoded);

  if (!decoded) {
    if (year === sampleData.year && month === sampleData.month) {
      return { entries: sampleData.entries, mealPrice: sampleData.mealPrice };
    }

    return {
      entries: getMonthDays(year, month).map((day) => ({
        date: toISODate(day),
        lunch: false,
        dinner: false
      })),
      mealPrice: 50
    };
  }

  const lunchSet = new Set(decoded.lunch);
  const dinnerSet = new Set(decoded.dinner);

  return {
    mealPrice: decoded.price,
    entries: getMonthDays(year, month).map((day) => {
      const date = toISODate(day);
      return {
        date,
        lunch: lunchSet.has(date),
        dinner: dinnerSet.has(date)
      };
    })
  };
}

export default async function ReportPage({
  params,
  searchParams
}: {
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<{ state?: string }>;
}) {
  const { year: yearRaw, month: monthRaw } = await params;
  const query = await searchParams;
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  const { entries, mealPrice } = buildFromState(year, month, query.state);

  return <ReportDocument year={year} month={month} mealPrice={mealPrice} entries={entries} />;
}
