
export enum Language {
  EN = 'en',
  TA = 'ta',
}

export enum ExpenseType {
  DAILY = 'daily',
  CREDIT = 'credit',
  SPECIAL = 'special',
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI',
}

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  date: string; // ISO string: 2025-05-29T10:00:00
  purpose: string;
  method: PaymentMethod;
  notes?: string;
  remindLater?: boolean;
}

export interface Translations {
  [key: string]: {
    [langKey in Language]: string;
  };
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
