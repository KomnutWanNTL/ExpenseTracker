// Formatting utilities for display
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) return 'วันนี้';
    if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'เมื่อวาน';
    
    return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
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
