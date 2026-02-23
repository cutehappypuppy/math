export type GameMode = 'classic' | 'time';

export interface Block {
  id: string;
  value: number;
  isSelected: boolean;
}

export const GRID_COLS = 6;
export const GRID_ROWS = 10;
export const INITIAL_ROWS = 4;
export const MAX_VALUE = 9;
export const MIN_TARGET = 10;
export const MAX_TARGET = 30;
export const TIME_LIMIT = 10; // seconds for time mode
