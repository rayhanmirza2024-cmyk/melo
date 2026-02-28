'use client';

import sampleData from '@/data/february-2026.json';
import { getMonthDays, toISODate } from '@/lib/dates';
import { getDailyCost, summarizeMonth, taka } from '@/lib/meal-calculations';
import { encodeState } from '@/lib/report-state';
import { MealEntry } from '@/lib/types';
import { useMemo, useState } from 'react';

function buildEntries(year: number, month: number, existing: MealEntry[]): MealEntry[] {
  const map = new Map(existing.map((entry) => [entry.date, entry]));

  return getMonthDays(year, month).map((day) => {
    const date = toISODate(day);
    const fromExisting = map.get(date);
    return {
      date,
      lunch: fromExisting?.lunch ?? false,
      dinner: fromExisting?.dinner ?? false
    };
  });
}

export default function DashboardPage() {
  const [year, setYear] = useState(sampleData.year);
  const [month, setMonth] = useState(sampleData.month);
  const [mealPrice, setMealPrice] = useState(sampleData.mealPrice);
  const [seedEntries] = useState<MealEntry[]>(sampleData.entries);
  const [entries, setEntries] = useState<MealEntry[]>(sampleData.entries);

  const effectiveEntries = useMemo(() => buildEntries(year, month, entries), [year, month, entries]);
  const summary = summarizeMonth(effectiveEntries, mealPrice);
  const encoded = encodeState(effectiveEntries, mealPrice);

  const toggle = (date: string, key: 'lunch' | 'dinner') => {
    setEntries((prev) => {
      const monthEntries = buildEntries(year, month, prev);
      return monthEntries.map((entry) => (entry.date === date ? { ...entry, [key]: !entry[key] } : entry));
    });
  };

  const previewHref = `/report/${year}/${month}?state=${encoded}`;
  const pdfHref = `/api/report/pdf?year=${year}&month=${month}&state=${encoded}`;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-semibold">Mealio</h1>
      <p className="mt-2 text-slate-600">Track monthly lunch and dinner records, then export a print-perfect PDF.</p>

      <section className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-4">
        <label className="flex flex-col gap-1">
          Year
          <input className="rounded border p-2" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1">
          Month
          <input className="rounded border p-2" type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1">
          Meal Price (৳)
          <input className="rounded border p-2" type="number" min={0} value={mealPrice} onChange={(e) => setMealPrice(Number(e.target.value) || 0)} />
        </label>
        <div className="flex items-end gap-2">
          <button onClick={() => setEntries(seedEntries)} className="rounded bg-slate-900 px-4 py-2 text-white">Reset Sample</button>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow lg:col-span-3">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-center">Lunch</th>
                <th className="px-3 py-2 text-center">Dinner</th>
                <th className="px-3 py-2 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {effectiveEntries.map((entry) => (
                <tr key={entry.date} className="border-b">
                  <td className="px-3 py-2">{entry.date}</td>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={entry.lunch} onChange={() => toggle(entry.date, 'lunch')} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={entry.dinner} onChange={() => toggle(entry.date, 'dinner')} />
                  </td>
                  <td className="px-3 py-2 text-right">{taka(getDailyCost(entry, mealPrice))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Summary</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Total Meals: {summary.totalMeals}</li>
            <li>Lunch: {summary.lunchCount} / {summary.daysInMonth}</li>
            <li>Dinner: {summary.dinnerCount} / {summary.daysInMonth}</li>
            <li>Total Bill: {taka(summary.totalBill)}</li>
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <a href={previewHref} target="_blank" className="rounded bg-blue-600 px-3 py-2 text-center text-white">Preview Report</a>
            <a href={pdfHref} className="rounded bg-emerald-600 px-3 py-2 text-center text-white">Generate PDF</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
