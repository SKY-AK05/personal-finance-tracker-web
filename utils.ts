
import { jsPDF } from 'jspdf';
import autoTable, { HookData } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Language, Expense, ExpenseType, AppNotification, PaymentMethod } from './types';
import { LOCAL_STORAGE_LANGUAGE_KEY, LOCAL_STORAGE_EXPENSES_KEY, TRANSLATIONS } from './constants';

// Define CellDef for jspdf-autotable - this is a custom type used for constructing table data.
// jspdf-autotable's own types will handle the actual cell rendering.
interface CellDef {
  content: string | number | string[];
  colSpan?: number;
  rowSpan?: number;
  styles?: Partial<{
    font?: string;
    fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    fillColor?: string | false | [number, number, number]; // Corrected for jspdf-autotable
    textColor?: string | [number, number, number]; // Corrected for jspdf-autotable
    halign?: 'left' | 'center' | 'right' | 'justify';
    valign?: 'top' | 'middle' | 'bottom';
    fontSize?: number;
  }>;
}


// --- Storage Utilities ---
export const getStoredLanguage = (): Language => {
  return (localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) as Language) || Language.EN;
};

export const setStoredLanguage = (language: Language): void => {
  localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
};

export const getStoredExpenses = (): Expense[] => {
  const expensesJson = localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY);
  if (expensesJson) {
    try {
      const parsedExpenses = JSON.parse(expensesJson) as Expense[];
      return parsedExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.error("Error parsing expenses from localStorage:", e);
      return [];
    }
  }
  return [];
};

export const setStoredExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
};

export const addExpenseToStorage = (expense: Expense): void => {
  const expenses = getStoredExpenses();
  setStoredExpenses([...expenses, expense].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const clearAllDataFromStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_EXPENSES_KEY);
  // Optionally, clear language too, or keep it
  // localStorage.removeItem(LOCAL_STORAGE_LANGUAGE_KEY);
};

// --- i18n Utilities ---
export const t = (key: string, lang: Language, replacements?: Record<string, string>): string => {
  const translationSet = TRANSLATIONS[key];
  if (!translationSet) {
    // Try to find a key with a common prefix if it's an expense type (e.g. 'daily' from 'dailyExpense')
    const simpleKeyMatch = Object.keys(TRANSLATIONS).find(k => 
        k.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(k.toLowerCase()));

    if (simpleKeyMatch && TRANSLATIONS[simpleKeyMatch]) {
        // console.warn(`Translation key "${key}" not found, but found similar "${simpleKeyMatch}". Using it.`);
        // return TRANSLATIONS[simpleKeyMatch][lang] || TRANSLATIONS[simpleKeyMatch][Language.EN];
         // Fallback for simple keys like 'daily' if 'dailyExpense' exists
        const expenseTypeKey = Object.keys(TRANSLATIONS).find(tk => tk.toLowerCase() === `${key.toLowerCase()}expense`);
        if (expenseTypeKey && TRANSLATIONS[expenseTypeKey]) {
          let translatedStr = TRANSLATIONS[expenseTypeKey][lang] || TRANSLATIONS[expenseTypeKey][Language.EN];
           if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
              translatedStr = translatedStr.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
          }
          return translatedStr;
        }
    }
    
    console.warn(`Translation key "${key}" not found.`);
    return key; // Return the key itself if no translation found
  }
  let translatedString = translationSet[lang] || TRANSLATIONS[key][Language.EN]; // Fallback to English
  
  if (replacements) {
    Object.keys(replacements).forEach(placeholder => {
      translatedString = translatedString.replace(`{${placeholder}}`, String(replacements[placeholder]));
    });
  }
  return translatedString;
};

// --- Date Utilities ---
export const formatDate = (isoDateString: string, lang: Language, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(isoDateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  return date.toLocaleDateString(lang === Language.TA ? 'ta-IN' : 'en-US', defaultOptions);
};

export const formatSimpleDate = (isoDateString: string, lang: Language): string => {
  const date = new Date(isoDateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return t('today', lang);
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return t('yesterday', lang);
  }
  return date.toLocaleDateString(lang === Language.TA ? 'ta-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
};


export const formatMonthYear = (date: Date, lang: Language): string => {
  return date.toLocaleDateString(lang === Language.TA ? 'ta-IN' : 'en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const getCurrentMonthYear = (): { month: number; year: number } => {
  const today = new Date();
  return { month: today.getMonth(), year: today.getFullYear() };
};

// --- Export Utilities ---
interface ExportData {
  expenses: Expense[];
  title: string;
  lang: Language;
}

const generatePdfContent = (data: ExportData) => {
  const doc = new jsPDF();
  const { expenses, title, lang } = data;

  doc.setFontSize(18);
  doc.text(title, 14, 22); // title is already string from ExportData

  const tableColumn = [
    t('date', lang), 
    t('type', lang), 
    t('amount', lang), 
    t('purpose', lang), 
    t('paymentMethod', lang),
    t('optionalNotes', lang)
  ];
  const tableRows: (string | number | CellDef)[][] = [];

  expenses.forEach(expense => {
    const expenseData = [
      formatDate(expense.date, lang, { hour: undefined, minute: undefined }),
      t(expense.type, lang), 
      `${t('rupeeSymbol', lang)}${expense.amount.toFixed(2)}`,
      expense.purpose,
      t(expense.method.toLowerCase() as keyof typeof TRANSLATIONS, lang) || expense.method, 
      expense.notes || ''
    ];
    tableRows.push(expenseData);
  });

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalRow: CellDef[] = [
    { content: t('grandTotal', lang), colSpan: 2, styles: { fontStyle: 'bold', halign: 'right' } },
    { content: `${t('rupeeSymbol', lang)}${totalAmount.toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'left' } },
    { content: '', colSpan: 3 } // Spans Purpose, Payment Method, Notes
  ];
  tableRows.push(totalRow as any); 

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { font: "Helvetica", fontSize: 10 }, 
    headStyles: { fillColor: [238, 193, 0] }, 
  });
  
  return doc;
};

export const exportToPdf = (data: ExportData, filename: string): void => {
  const doc = generatePdfContent(data);
  doc.save(`${filename}.pdf`);
};

export const exportAllDataToPdf = (allExpenses: Expense[], lang: Language): void => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text(t('appName', lang), 14, 20); 
  doc.setFontSize(12);
  doc.text(t('exportAllData', lang), 14, 30);

  let currentY = 40;

  const expensesByMonth: { [monthYear: string]: Expense[] } = {};
  allExpenses.forEach(expense => {
    const monthYear = formatMonthYear(new Date(expense.date), lang);
    if (!expensesByMonth[monthYear]) {
      expensesByMonth[monthYear] = [];
    }
    expensesByMonth[monthYear].push(expense);
  });

  Object.entries(expensesByMonth)
    .sort(([monthA], [monthB]) => {
      const dateA = new Date(monthA.split(" ").reverse().join(" ")); 
      const dateB = new Date(monthB.split(" ").reverse().join(" "));
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          const parsedDateA = getMonthIndex(monthA.split(" ")[0], lang) !== -1 ? new Date(parseInt(monthA.split(" ")[1]), getMonthIndex(monthA.split(" ")[0], lang)) : new Date(monthA);
          const parsedDateB = getMonthIndex(monthB.split(" ")[0], lang) !== -1 ? new Date(parseInt(monthB.split(" ")[1]), getMonthIndex(monthB.split(" ")[0], lang)) : new Date(monthB);
          return parsedDateA.getTime() - parsedDateB.getTime();
      }
      return dateA.getTime() - dateB.getTime();
    })
    .forEach(([monthYear, expenses]) => {
    if (currentY > 250) { 
      doc.addPage();
      currentY = 20;
    }
    doc.setFontSize(16);
    doc.text(monthYear, 14, currentY); 
    currentY += 10;

    const tableColumn = [
      t('date', lang), t('type', lang), t('amount', lang), t('purpose', lang), t('paymentMethod', lang)
    ];
    const tableRows: (string | number | CellDef)[][] = [];

    expenses.forEach(expense => {
      tableRows.push([
        formatDate(expense.date, lang, {day: 'numeric', month: 'short', hour: undefined, minute: undefined}),
        t(expense.type, lang),
        `${t('rupeeSymbol', lang)}${expense.amount.toFixed(2)}`,
        expense.purpose,
        t(expense.method.toLowerCase() as keyof typeof TRANSLATIONS, lang) || expense.method
      ]);
    });
    
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRow: CellDef[] = [
      { content: t('grandTotal', lang), colSpan: 2, styles: { fontStyle: 'bold', halign: 'right' } },
      { content: `${t('rupeeSymbol', lang)}${totalAmount.toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'left' } },
      { content: '', colSpan: 2 } // Spans Purpose, Payment Method
    ];
    tableRows.push(totalRow as any);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: currentY,
      styles: { font: "Helvetica", fontSize: 9 },
      headStyles: { fillColor: [238, 193, 0] }, 
      didDrawPage: (hookData: HookData) => { 
        currentY = hookData.cursor?.y ?? currentY;
      }
    });
    currentY += 10; 
  });

  doc.save(`all_expenses_report_${new Date().toISOString().split('T')[0]}.pdf`);
};


export const exportToExcel = (data: ExportData, filename: string): void => {
  const { expenses, lang } = data;
  const worksheetData = expenses.map(expense => ({
    [t('date', lang)]: formatDate(expense.date, lang, { hour: undefined, minute: undefined }),
    [t('type', lang)]: t(expense.type, lang),
    [t('amount', lang)]: expense.amount.toFixed(2), 
    [t('purpose', lang)]: expense.purpose,
    [t('paymentMethod', lang)]: t(expense.method.toLowerCase() as keyof typeof TRANSLATIONS, lang) || expense.method,
    [t('optionalNotes', lang)]: expense.notes || '',
  }));

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalRow: {[key: string]: string} = {}; 
  totalRow[t('date', lang)] = t('grandTotal', lang);
  totalRow[t('type', lang)] = '';
  totalRow[t('amount', lang)] = totalAmount.toFixed(2); 
  totalRow[t('purpose', lang)] = '';
  totalRow[t('paymentMethod', lang)] = '';
  totalRow[t('optionalNotes', lang)] = '';
  worksheetData.push(totalRow);


  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  
  const columnWidths = [
    { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 30 },
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};


export const exportAllDataToExcel = (allExpenses: Expense[], lang: Language): void => {
  const workbook = XLSX.utils.book_new();

  const expensesByMonth: { [monthYear: string]: Expense[] } = {};
  allExpenses.forEach(expense => {
    const monthYear = formatMonthYear(new Date(expense.date), lang);
    if (!expensesByMonth[monthYear]) {
      expensesByMonth[monthYear] = [];
    }
    expensesByMonth[monthYear].push(expense);
  });
  
  Object.entries(expensesByMonth)
    .sort(([monthA], [monthB]) => {
        const [monthNameA, yearStringA] = monthA.split(" ");
        const [monthNameB, yearStringB] = monthB.split(" ");
        
        const yearA = parseInt(yearStringA, 10);
        const yearB = parseInt(yearStringB, 10);

        const monthIndexA = getMonthIndex(monthNameA, lang);
        const monthIndexB = getMonthIndex(monthNameB, lang);
        
        const dateAVal = (yearA && monthIndexA !== -1) ? new Date(yearA, monthIndexA, 1).getTime() : new Date(monthA).getTime();
        const dateBVal = (yearB && monthIndexB !== -1) ? new Date(yearB, monthIndexB, 1).getTime() : new Date(monthB).getTime();

        if (isNaN(dateAVal) && isNaN(dateBVal)) return 0; 
        if (isNaN(dateAVal)) return 1; 
        if (isNaN(dateBVal)) return -1; 
        
        return dateAVal - dateBVal;
    })
    .forEach(([monthYear, expenses]) => {
      const worksheetData = expenses.map(expense => ({
        [t('date', lang)]: formatDate(expense.date, lang, {day: 'numeric', month: 'short', hour: undefined, minute: undefined}),
        [t('type', lang)]: t(expense.type, lang),
        [t('amount', lang)]: expense.amount.toFixed(2),
        [t('purpose', lang)]: expense.purpose,
        [t('paymentMethod', lang)]: t(expense.method.toLowerCase() as keyof typeof TRANSLATIONS, lang) || expense.method,
        [t('optionalNotes', lang)]: expense.notes || '',
      }));
      
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalRowExcel: {[key: string]: string} = {}; 
      totalRowExcel[t('date', lang)] = t('grandTotal', lang);
      totalRowExcel[t('type', lang)] = '';
      totalRowExcel[t('amount', lang)] = totalAmount.toFixed(2);
      totalRowExcel[t('purpose', lang)] = '';
      totalRowExcel[t('paymentMethod', lang)] = '';
      totalRowExcel[t('optionalNotes', lang)] = '';
      worksheetData.push(totalRowExcel);

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const safeMonthYear = monthYear.replace(/[^a-zA-Z0-9_ ]/g, '').substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, safeMonthYear);
      
      const columnWidths = [ { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 20 }];
      worksheet['!cols'] = columnWidths;
  });

  XLSX.writeFile(workbook, `all_expenses_report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const getMonthIndex = (monthName: string, lang: Language): number => {
  const testDate = new Date(2000, 0, 1); 
  for (let i = 0; i < 12; i++) {
    testDate.setMonth(i);
    if (testDate.toLocaleDateString(lang === Language.TA ? 'ta-IN' : 'en-US', { month: 'long' }).toLowerCase() === monthName.toLowerCase().trim()) {
      return i;
    }
  }
  const monthNamesEn = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const monthNamesTa = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"]; 
  
  const namesToUse = lang === Language.TA ? monthNamesTa : monthNamesEn;
  const index = namesToUse.findIndex(name => name.toLowerCase() === monthName.toLowerCase().trim());
  if (index !== -1) return index;

  return -1; 
};


// --- Notification Utilities ---
let notificationTimeoutId: number | null = null;

export const showNotification = (
  message: string,
  type: AppNotification['type'],
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification | null>>
): void => {
  if (notificationTimeoutId) {
    clearTimeout(notificationTimeoutId);
  }
  const newNotification: AppNotification = { id: Date.now().toString(), message, type };
  setNotifications(newNotification);
  notificationTimeoutId = window.setTimeout(() => { 
    setNotifications(null);
  }, 3000);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
