import { formatTableDate, monthLabel } from '@/lib/dates';
import { getDailyCost, summarizeMonth, taka } from '@/lib/meal-calculations';
import { MealEntry } from '@/lib/types';

type Props = {
  year: number;
  month: number;
  mealPrice: number;
  entries: MealEntry[];
};

export function ReportDocument({ year, month, mealPrice, entries }: Props) {
  const summary = summarizeMonth(entries, mealPrice);

  return (
    <main className="mx-auto max-w-[210mm] bg-white px-10 py-10 text-[14px] leading-6 text-slate-800">
      <section className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Mealio — Monthly Report</h1>
        <p className="mt-2 text-lg text-slate-600">{monthLabel(year, month)}</p>
        <div className="mt-4 space-y-1 text-[15px]">
          <p>Total Meals: {summary.totalMeals}</p>
          <p>
            Lunch: {summary.lunchCount} / {summary.daysInMonth}
          </p>
          <p>
            Dinner: {summary.dinnerCount} / {summary.daysInMonth}
          </p>
          <p>Total Bill: {taka(summary.totalBill)}</p>
        </div>
      </section>

      <table className="w-full border-collapse text-sm print:text-[12px]">
        <thead className="bg-blue-600 text-white print:table-header-group">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Date</th>
            <th className="px-3 py-2 text-center font-medium">Lunch</th>
            <th className="px-3 py-2 text-center font-medium">Dinner</th>
            <th className="px-3 py-2 text-right font-medium">Cost</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.date} className="border-b border-slate-200">
              <td className="px-3 py-2">{formatTableDate(entry.date)}</td>
              <td className="px-3 py-2 text-center">{entry.lunch ? '✓' : '–'}</td>
              <td className="px-3 py-2 text-center">{entry.dinner ? '✓' : '–'}</td>
              <td className="px-3 py-2 text-right">{taka(getDailyCost(entry, mealPrice))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-8 break-inside-avoid">
        <h2 className="text-xl font-semibold">Billing Breakdown</h2>
        <div className="mt-2 space-y-1">
          <p>
            Lunch: {summary.lunchCount} × {taka(mealPrice)} = {taka(summary.lunchCount * mealPrice)}
          </p>
          <p>
            Dinner: {summary.dinnerCount} × {taka(mealPrice)} = {taka(summary.dinnerCount * mealPrice)}
          </p>
          <p className="font-semibold">Total: {taka(summary.totalBill)}</p>
        </div>
      </section>
    </main>
  );
}
