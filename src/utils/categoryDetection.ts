import type { Category } from '../types/expense';

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  food: [
    'ข้าว',
    'อาหาร',
    'กิน',
    'ก๋วยเตี๋ยว',
    'ชานม',
    'กาแฟ',
    'น้ำดื่ม',
    'restaurant',
    'meal',
  ],
  transport: [
    'bts',
    'mrt',
    'แท็กซี่',
    'taxi',
    'grab',
    'bolt',
    'รถเมล์',
    'รถไฟ',
    'เดินทาง',
    'ทางด่วน',
    'เติมน้ำมัน',
    'น้ำมัน',
  ],
  shopping: [
    'ซื้อ',
    'ช้อป',
    'shopping',
    'ของใช้',
    'เสื้อ',
    'กางเกง',
    'รองเท้า',
    'supermarket',
    'shopee',
    'tiktok',
  ],
  bills: [
    'ค่าไฟ',
    'ค่าน้ำ',
    'ค่าเน็ต',
    'อินเทอร์เน็ต',
    'internet',
    'โทรศัพท์',
    'มือถือ',
    'บิล',
    'bill',
    'ค่าเช่า',
  ],
  entertainment: [
    'หนัง',
    'netflix',
    'เกม',
    'เที่ยว',
    'คอนเสิร์ต',
    'concert',
    'karaoke',
  ],
  health: [
    'ยา',
    'หมอ',
    'โรงพยาบาล',
    'คลินิก',
    'clinic',
    'vitamin',
  ],
  family: [
    'ครอบครัว',
    'ลูก',
    'พ่อ',
    'แม่',
    'ภรรยา',
    'สามี',
    'ค่าเทอม',
    'เลี้ยงลูก',
  ],
  other: [],
};

const DETECTION_ORDER: Category[] = [
  'transport',
  'bills',
  'food',
  'shopping',
  'entertainment',
  'health',
  'family',
];

function normalizeNote(note: string): string {
  return note.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function detectCategoryFromNote(note: string): Category {
  const normalizedNote = normalizeNote(note);
  if (!normalizedNote) return 'other';

  for (const category of DETECTION_ORDER) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.some(keyword => normalizedNote.includes(keyword))) {
      return category;
    }
  }

  return 'other';
}
