// Category color mapping for consistent color per category
import type { Category } from '../types/expense';

export const CATEGORY_COLORS: Record<Category, string> = {
  bills: '#A29BFE',         // ม่วงหม่น (นิ่ง/ภาระประจำ)
  entertainment: '#FFEAA7', // เหลืองหม่น (สนุก)
  family: '#c08484',        // แดงหม่น (ครอบครัว/ดูแล)
  food: '#74B9FF',          // น้ำเงินหม่น (กลางๆ)
  health: '#55EFC4',        // เขียวหม่น (สุขภาพ)
  other: '#B2BEC3',         // เทา (ไม่ต้องเด่น)
  transport: '#FAB1A0',     // ชมพูหม่น (เคลื่อนไหว)
  shopping: '#f472b6',      // (ยังไม่กำหนด ขอใช้ชมพูเดิม)
};
