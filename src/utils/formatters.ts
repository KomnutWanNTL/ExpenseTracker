// Formatting utilities for display
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
export function formatDate(isoDate: string): string {
  try {
    const date = dayjs(isoDate).tz('Asia/Bangkok');
    const today = dayjs().tz('Asia/Bangkok');
    const yesterday = today.subtract(1, 'day');
    if (date.isSame(today, 'day')) return 'วันนี้';
    if (date.isSame(yesterday, 'day')) return 'เมื่อวาน';
    return date.format('D MMM');
  } catch {
    return isoDate;
  }
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
