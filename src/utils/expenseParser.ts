// Expense parser utility for quick add input
// - Parse trailing number as amount
// - Parse leading text as note
// - If multiple numbers exist, use the last one
// - Trim redundant whitespace
// - Return structured parse result with validation state

export interface ParseResult {
  note: string;
  amount: number | null;
  valid: boolean;
  error?: string;
}

export function parseExpenseInput(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { note: '', amount: null, valid: false, error: 'กรุณากรอกข้อมูล' };
  // Match all numbers (integer or decimal)
  const matches = trimmed.match(/([0-9]+(?:\.[0-9]+)?)/g);
  if (!matches || matches.length === 0) {
    return { note: trimmed, amount: null, valid: false, error: 'ต้องมีจำนวนเงิน' };
  }
  const amountStr = matches[matches.length - 1];
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { note: trimmed, amount: null, valid: false, error: 'จำนวนเงินไม่ถูกต้อง' };
  }
  // Remove the last number from the string to get the note
  const note = trimmed.replace(new RegExp(amountStr + '$'), '').trim();
  return { note, amount, valid: true };
}

export function parseMultiLineInput(input: string): ParseResult[] {
  const lines = input.split('\n');
  return lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => parseExpenseInput(line));
}
