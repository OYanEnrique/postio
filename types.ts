export type UniqueId = string | number;

export interface Task {
  id: UniqueId;
  columnId: UniqueId;
  title: string;
  description?: string;
  color: string;
  completed: boolean;
  createdAt: string; // ISO Date string
  completedAt?: string; // ISO Date string
}

export interface Column {
  id: UniqueId;
  title: string;
}

// Cores baseadas na paleta Postio: #f3f5f0, #539190, #83ecbb
export const CARD_COLORS = [
  { name: 'White', value: 'bg-white border-transparent' },
  { name: 'Mint', value: 'bg-[#83ecbb] border-[#539190]/20' }, // Primary Container
  { name: 'Surface', value: 'bg-[#f3f5f0] border-[#539190]/20' }, // App Background
  { name: 'Soft Teal', value: 'bg-[#d0e0e0] border-transparent' }, // Desaturated Primary
  { name: 'Deep Teal', value: 'bg-[#539190] text-white border-transparent' }, // Primary (Dark)
];