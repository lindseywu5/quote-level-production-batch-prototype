export type DueType = "ship" | "delivery";

export interface Batch {
  id: string;
  qty: number;
  dueDate: string; // ISO yyyy-mm-dd
  dueType: DueType;
  /** UI-only flag for inline edit mode */
  editing?: boolean;
}

export interface Item {
  id: string;
  name: string;
  version: string;
  process: string;
  material: string;
  finish: string;
  inspection: string;
  qty: number;
  basePrice: number;
  batches: Batch[];
  /** Emoji or short string used as a thumbnail placeholder */
  thumb: string;
  /** Background gradient classes for the thumbnail tile */
  thumbBg: string;
}
