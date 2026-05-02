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
    if (date.isSame(today, 'day')) return 'วันนี้';
    // แสดงเป็น 2 พ.ค. (ไทย) เสมอถ้าไม่ใช่วันนี้
    // ใช้ Intl.DateTimeFormat เพื่อให้ได้เดือนย่อไทย
    return date.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
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
