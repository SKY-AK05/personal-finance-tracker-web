import React from 'react';
import { Language, ExpenseType, PaymentMethod, Translations } from './types';

export const APP_TITLE = "Personal Finance Tracker";

export const LOCAL_STORAGE_LANGUAGE_KEY = 'financeTrackerLanguage';
export const LOCAL_STORAGE_EXPENSES_KEY = 'financeTrackerExpenses';

export const EXPENSE_TYPE_OPTIONS = [
  { value: ExpenseType.DAILY, labelKey: 'dailyExpense' },
  { value: ExpenseType.CREDIT, labelKey: 'creditCardExpense' },
  { value: ExpenseType.SPECIAL, labelKey: 'specialExpense' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.CASH, labelKey: 'cash' },
  { value: PaymentMethod.CARD, labelKey: 'card' },
  { value: PaymentMethod.UPI, labelKey: 'upi' },
];

export const ICONS = {
  plus: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg>,
  creditCard: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /> </svg>,
  gift: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"> <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 0 0 12 8.25v3m0-3c0 .845.683 1.538 1.538 1.538h.001c.844 0 1.537-.693 1.537-1.538M12 4.875A3.375 3.375 0 0 1 12 8.25v3m0-3c0 .845-.683 1.538-1.538 1.538h-.001C9.684 9.788 9 9.095 9 8.25m9.75 0h.008v.008H18.75v-.008Zm0 0c0 .844-.693 1.537-1.538 1.537h-.001c-.845 0-1.538-.693-1.538-1.537M3.75 0h.008v.008H3.75v-.008Zm0 0c0 .844.693 1.537 1.538 1.537h.001c.845 0 1.538-.693 1.538-1.537M12 4.875v.008H12v-.008Z" /> </svg>,
  chart: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 14.25m-1.5 0h3v3h-3v-3Zm15 0m-1.5 0h3v3h-3v-3Zm-7.5 0m-1.5 0h3v3h-3v-3Z" /> </svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"> <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /> </svg>,
  back: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /> </svg>,
  export: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg>,
  delete: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"> <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg>,
  calendar: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg>,
  amount: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h1a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2zm0 0V9" /> </svg>,
  purpose: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /> </svg>,
  paymentMethod: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>,
  notes: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> </svg>,
  reminder: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>,
  home: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /> </svg>,
  edit: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /> </svg>,
  trash: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg>,
  viewAll: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 ml-1"> <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /> </svg>,
};

export const TRANSLATIONS: Translations = {
  // General
  appName: { en: 'Finance Tracker', ta: 'நிதி டிராக்கர்' },
  chooseLanguage: { en: 'Choose Your Language', ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்' },
  english: { en: '🇬🇧 English', ta: '🇬🇧 ஆங்கிலம்' },
  tamil: { en: '🇮🇳 தமிழ்', ta: '🇮🇳 தமிழ்' },
  save: { en: 'Save', ta: 'சேமி' },
  cancel: { en: 'Cancel', ta: 'ரத்துசெய்' },
  confirm: { en: 'Confirm', ta: 'உறுதிப்படுத்து' },
  loading: { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
  rupeeSymbol: { en: '₹', ta: '₹' },
  goBack: { en: 'Go Back', ta: 'திரும்பிச் செல்' },
  home: { en: 'Home', ta: 'முகப்பு' },
  summary: { en: 'Summary', ta: 'சுருக்கம்' },
  trackExpensesEasily: { en: 'Track your expenses easily', ta: 'உங்கள் செலவுகளை எளிதாகக் கண்காணிக்கவும்' },
  expensesSummary: { en: 'Expenses Summary', ta: 'செலவுகள் சுருக்கம்' },
  today: { en: 'Today', ta: 'இன்று' },
  thisMonth: { en: 'This Month', ta: 'இந்த மாதம்' },
  
  // Home Screen
  addDailyExpense: { en: 'Add Daily Expense', ta: 'தினசரி செலவைச் சேர்க்கவும்' },
  addCreditCardExpense: { en: 'Add Credit Card Expense', ta: 'கிரெடிட் கார்டு செலவைச் சேர்க்கவும்' },
  addSpecialExpense: { en: 'Add Special Expense', ta: 'சிறப்புச் செலவைச் சேர்க்கவும்' },
  viewMonthlyDashboard: { en: 'View Monthly Dashboard', ta: 'மாதாந்திர டாஷ்போர்டைக் காண்க' },
  settings: { en: 'Settings', ta: 'அமைப்புகள்' },
  quickActions: { en: 'Quick Actions', ta: 'விரைவுச் செயல்கள்' },
  recentTransactions: { en: 'Recent Transactions', ta: 'சமீபத்திய பரிவர்த்தனைகள்' },
  noTransactionsYet: { en: 'No transactions yet. Add one to get started!', ta: 'இன்னும் பரிவர்த்தனைகள் இல்லை. தொடங்க ஒன்றைச் சேர்க்கவும்!' },
  viewAllTransactions: { en: 'View All Transactions', ta: 'அனைத்து பரிவர்த்தனைகளையும் காண்க' },
  yesterday: { en: 'Yesterday', ta: 'நேற்று' },


  // Add Expense Screen / Edit Expense Screen
  addExpenseTitle: { en: 'Add {expenseType} Expense', ta: '{expenseType} செலவைச் சேர்க்கவும்' }, 
  editExpenseTitle: { en: 'Edit {expenseType} Expense', ta: '{expenseType} செலவைத் திருத்து' },
  dailyExpense: { en: 'Daily', ta: 'தினசரி' },
  creditCardExpense: { en: 'Credit Card', ta: 'கிரெடிட் கார்டு'},
  specialExpense: { en: 'Special', ta: 'சிறப்பு' },
  dateAndTime: { en: 'Date & Time', ta: 'தேதி மற்றும் நேரம்' },
  amount: { en: 'Amount', ta: 'தொகை' },
  purpose: { en: 'Purpose / Category', ta: 'நோக்கம் / வகை' },
  paymentMethod: { en: 'Payment Method', ta: 'பணம் செலுத்தும் முறை' },
  cash: { en: 'Cash', ta: 'பணம்' },
  card: { en: 'Card', ta: 'அட்டை' },
  upi: { en: 'UPI', ta: 'UPI' },
  optionalNotes: { en: 'Optional Notes', ta: 'விருப்பக்குறிப்புகள்' },
  remindMeLater: { en: 'Remind Me Later', ta: 'பின்னர் நினைவூட்டு' },
  expenseSaved: { en: 'Expense saved successfully!', ta: 'செலவு வெற்றிகரமாக சேமிக்கப்பட்டது!' },
  expenseUpdated: { en: 'Expense updated successfully!', ta: 'செலவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' },
  expenseDeleted: { en: 'Expense deleted successfully!', ta: 'செலவு வெற்றிகரமாக நீக்கப்பட்டது!' },
  errorSavingExpense: { en: 'Error saving expense.', ta: 'செலவைச் சேமிப்பதில் பிழை.' },
  errorUpdatingExpense: { en: 'Error updating expense.', ta: 'செலவைப் புதுப்பிப்பதில் பிழை.' },
  errorDeletingExpense: { en: 'Error deleting expense.', ta: 'செலவை நீக்குவதில் பிழை.' },
  validationError: { en: 'Please fill all required fields correctly.', ta: 'தேவையான அனைத்து புலங்களையும் சரியாக நிரப்பவும்.' },
  amountPositive: {en: 'Amount must be a positive number.', ta: 'தொகை நேர்மறை எண்ணாக இருக்க வேண்டும்.'},

  // Dashboard Screen
  monthlyDashboard: { en: 'Monthly Dashboard', ta: 'மாதாந்திர டாஷ்போர்டு' },
  selectMonth: { en: 'Select Month', ta: 'மாதத்தைத் தேர்ந்தெடுக்கவும்' },
  totalDailyExpenses: { en: 'Total Daily Expenses', ta: 'மொத்த தினசரி செலவுகள்' },
  totalCreditCardExpenses: { en: 'Total Credit Card Expenses', ta: 'மொத்த கிரெடிட் கார்டு செலவுகள்' },
  totalSpecialExpenses: { en: 'Total Special Expenses', ta: 'மொத்த சிறப்புச் செலவுகள்' },
  grandTotal: { en: 'Grand Total', ta: 'மொத்த தொகை' },
  goToSummary: { en: 'Go to Monthly Summary', ta: 'மாதாந்திர சுருக்கத்திற்குச் செல்' },
  noDataForMonth: { en: 'No data available for this month.', ta: 'இந்த மாதத்திற்கு தரவு எதுவும் இல்லை.' },
  expensesByType: { en: 'Expenses by Type', ta: 'வகை வாரியான செலவுகள்' },
  
  // Monthly Summary Screen
  monthlySummaryTitle: { en: 'Monthly Summary', ta: 'மாதாந்திர சுருக்கம்'}, 
  monthlySummaryForMonth: { en: 'Monthly Summary for {month}', ta: '{month} க்கான மாதாந்திர சுருக்கம்' }, 
  daily: { en: 'Daily', ta: 'தினசரி' },
  creditCard: { en: 'Credit Card', ta: 'கிரெடிட் கார்டு' },
  special: { en: 'Special', ta: 'சிறப்பு' },
  date: { en: 'Date', ta: 'தேதி' },
  type: { en: 'Type', ta: 'வகை' },
  exportThisMonth: { en: 'Export This Month', ta: 'இந்த மாதத்தை ஏற்றுமதி செய்' },
  exportAsPDF: { en: 'Export as PDF', ta: 'PDF ஆக ஏற்றுமதி செய்' },
  exportAsExcel: { en: 'Export as Excel', ta: 'Excel ஆக ஏற்றுமதி செய்' },
  noEntries: { en: 'No entries for this period.', ta: 'இந்த காலத்திற்கு பதிவுகள் இல்லை.'},
  all: { en: 'All', ta: 'அனைத்தும்' }, // For tab in summary

  // Settings Screen
  language: { en: 'Language', ta: 'மொழி' },
  exportOptions: { en: 'Export Options', ta: 'ஏற்றுமதி விருப்பங்கள்' },
  exportAllData: { en: 'Export All Data (PDF)', ta: 'எல்லா தரவையும் ஏற்றுமதி செய் (PDF)' },
  exportAllDataExcel: { en: 'Export All Data (Excel)', ta: 'எல்லா தரவையும் ஏற்றுமதி செய் (Excel)' },
  clearAllData: { en: 'Clear All Data', ta: 'எல்லா தரவையும் அழி' },
  confirmClearAllData: { en: 'Are you sure you want to clear ALL data? This action cannot be undone.', ta: 'நீங்கள் எல்லா தரவையும் அழிக்க விரும்புகிறீர்களா? இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.' },
  dataCleared: { en: 'All data cleared successfully.', ta: 'எல்லா தரவும் வெற்றிகரமாக அழிக்கப்பட்டது.' },
  errorClearingData: { en: 'Error clearing data.', ta: 'தரவை அழிப்பதில் பிழை.' },
  dataExported: { en: 'Data exported successfully!', ta: 'தரவு வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டது!' },
  errorExportingData: { en: 'Error exporting data.', ta: 'தரவை ஏற்றுமதி செய்வதில் பிழை.' },

  // Expense List Page
  manageExpensesTitle: { en: '{expenseType} Expenses', ta: '{expenseType} செலவுகள்' }, // e.g. "Daily Expenses"
  addNew: { en: 'Add New', ta: 'புதிதாகச் சேர்' },
  addNewExpenseType: { en: 'Add New {expenseType}', ta: 'புதிய {expenseType} ஐச் சேர்' }, // e.g. "Add New Daily"
  modify: { en: 'Modify', ta: 'மாற்றியமை' },
  delete: { en: 'Delete', ta: 'நீக்கு' },
  confirmDeleteExpense: { en: 'Are you sure you want to delete this expense?', ta: 'இந்த செலவை நீக்க விரும்புகிறீர்களா?' },
  purposeLabel: { en: 'Purpose:', ta: 'நோக்கம்:' },
  amountLabel: { en: 'Amount:', ta: 'தொகை:' },
  dateLabel: { en: 'Date:', ta: 'தேதி:' },
  methodLabel: {en: 'Method:', ta: 'முறை:' },
  notesLabel: {en: 'Notes:', ta: 'குறிப்புகள்:' },
  noExpensesOfType: { en: 'No {expenseType} expenses recorded yet. Add one!', ta: 'இன்னும் {expenseType} செலவுகள் பதிவு செய்யப்படவில்லை. ஒன்றைச் சேர்க்கவும்!' },


  // Common UI
  close: { en: 'Close', ta: 'மூடு' },
};
