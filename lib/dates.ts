import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';

export function getMonthDays(year: number, month: number): Date[] {
  const first = new Date(year, month - 1, 1);
  const last = endOfMonth(first);
  return eachDayOfInterval({ start: startOfMonth(first), end: last });
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatTableDate(dateIso: string): string {
  return format(new Date(`${dateIso}T00:00:00`), 'dd MMM, EEE');
}

export function monthLabel(year: number, month: number): string {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy');
}
