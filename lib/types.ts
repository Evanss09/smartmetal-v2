export type DuctType = 'TDF' | 'S&D' | 'Round';
export type SupportType = 'Band Iron' | 'Channel' | 'Unistrut';
export type DuctSize = 'small' | 'medium' | 'large';
export type RestrictionType = 'max-width' | 'max-height';

export interface CalculatorInputs {
  ductLengthFt: number;
  ductType: DuctType;
  supportType: SupportType;
  ductSize: DuctSize;
}

export interface MaterialLine {
  key: string;
  label: string;
  quantity: number;
  unit: string;
}

export interface CalculatorResults {
  lines: MaterialLine[];
  ductType: DuctType;
  supportType: SupportType;
}

export interface DuctulatorInput {
  widthIn: number;
  heightIn: number;
  restrictionType: RestrictionType;
  restrictionValueIn: number;
}

export interface DuctulatorOption {
  w: number;
  h: number;
  cfm: number;
  area: number;
  areaDiff: number;
}

export interface DuctulatorResult {
  originalCFM: number;
  originalWidth: number;
  originalHeight: number;
  restrictionType: RestrictionType;
  restrictionValueIn: number;
  options: DuctulatorOption[];
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface User {
  email: string;
  password: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  userEmail: string | null;
}
