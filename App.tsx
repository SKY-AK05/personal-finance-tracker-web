
import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Language, Expense, AppNotification, ExpenseType } from './types';
import { 
  getStoredLanguage, 
  setStoredLanguage, 
  getStoredExpenses, 
  setStoredExpenses,
  addExpenseToStorage, 
  clearAllDataFromStorage, 
  t as translate, 
  showNotification as utilShowNotification 
} from './utils';
import { LanguageSelectionPage, HomePage, AddExpensePage, DashboardPage, MonthlySummaryPage, SettingsPage, ExpenseListPage } from './components/PageComponents';
import { ICONS, APP_TITLE, LOCAL_STORAGE_LANGUAGE_KEY, TRANSLATIONS } from './constants';

// --- Contexts ---
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}
export const LanguageContext = createContext<LanguageContextType>({
  language: Language.EN,
  setLanguage: () => {},
  t: (key: string) => key,
});

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updatedExpenseData: Partial<Omit<Expense, 'id'>>) => void;
  deleteExpense: (id: string) => void;
  clearAllExpenses: () => void;
  getExpenseById: (id: string) => Expense | undefined;
}
export const ExpenseContext = createContext<ExpenseContextType>({
  expenses: [],
  addExpense: () => {},
  updateExpense: () => {},
  deleteExpense: () => {},
  clearAllExpenses: () => {},
  getExpenseById: () => undefined,
});

interface NotificationContextType {
  notification: AppNotification | null;
  showNotification: (message: string, type: AppNotification['type']) => void;
}
export const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => {},
});

// --- Bottom Navigation Bar ---
interface NavItemProps {
  to: string;
  icon: React.ReactElement<{ className?: string }>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-1/3 pt-2 pb-1 text-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-app-accent/50 rounded
       ${isActive ? 'text-app-accent font-semibold' : 'text-app-secondary hover:text-app-text'}`
    }
  >
    {React.cloneElement(icon, { className: "w-6 h-6 mb-0.5" })}
    <span>{label}</span>
  </NavLink>
);

const BottomNavigationBar: React.FC = () => {
  const { t } = React.useContext(LanguageContext);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-app-bg border-t border-gray-200 shadow-top-nav flex justify-around items-stretch h-16 z-40">
      <NavItem to="/home" icon={ICONS.home} label={t('home')} />
      <NavItem to="/dashboard" icon={ICONS.chart} label={t('summary')} />
      <NavItem to="/settings" icon={ICONS.settings} label={t('settings')} />
    </nav>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [language, setCurrentLanguage] = useState<Language>(getStoredLanguage());
  const [expenses, setCurrentExpenses] = useState<Expense[]>(getStoredExpenses());
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set document title from constants or translated app name
    const appNameKey = 'appName';
    const currentAppName = TRANSLATIONS[appNameKey] ? TRANSLATIONS[appNameKey][language] || TRANSLATIONS[appNameKey][Language.EN] : APP_TITLE;
    document.title = currentAppName;
    
    const storedLang = getStoredLanguage();
    setCurrentLanguage(storedLang);

    const explicitlySetLang = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
    if (!explicitlySetLang && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
    
    setCurrentExpenses(getStoredExpenses());
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if(isInitialized) { 
        setStoredLanguage(language);
        const appNameKey = 'appName';
        const currentAppName = TRANSLATIONS[appNameKey] ? TRANSLATIONS[appNameKey][language] || TRANSLATIONS[appNameKey][Language.EN] : APP_TITLE;
        document.title = currentAppName;
    }
  }, [language, isInitialized]);

  useEffect(() => {
     if(isInitialized) {
        setStoredExpenses(expenses);
     }
  }, [expenses, isInitialized]);


  const handleSetLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const handleAddExpense = (expense: Expense) => {
    setCurrentExpenses(prevExpenses => [...prevExpenses, expense].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const handleUpdateExpense = (id: string, updatedExpenseData: Partial<Omit<Expense, 'id'>>) => {
    setCurrentExpenses(prevExpenses =>
      prevExpenses.map(exp =>
        exp.id === id ? { ...exp, ...updatedExpenseData } : exp
      ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const handleDeleteExpense = (id: string) => {
    setCurrentExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
  };

  const handleClearAllExpenses = () => {
    setCurrentExpenses([]);
  };

  const getExpenseById = (id: string): Expense | undefined => {
    return expenses.find(exp => exp.id === id);
  };

  const t = (key: string, replacements?: Record<string, string>) => {
    return translate(key, language, replacements);
  };
  
  const displayNotification = (message: string, type: AppNotification['type']) => {
    utilShowNotification(message, type, setNotification);
  };

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen text-2xl bg-app-bg text-app-text">{translate('loading', Language.EN)}</div>;
  }

  const explicitlySetLang = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
  if (!explicitlySetLang && location.pathname !== '/') {
     return <div className="flex items-center justify-center min-h-screen text-2xl bg-app-bg text-app-text">{translate('loading', Language.EN)}</div>;
  }

  const showBottomNav = location.pathname !== '/';
  const isAddOrEditPage = location.pathname.startsWith('/add/') || location.pathname.startsWith('/edit/');


  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <ExpenseContext.Provider value={{ expenses, addExpense: handleAddExpense, updateExpense: handleUpdateExpense, deleteExpense: handleDeleteExpense, clearAllExpenses: handleClearAllExpenses, getExpenseById }}>
        <NotificationContext.Provider value={{ notification, showNotification: displayNotification }}>
          <div className="flex flex-col min-h-screen bg-app-bg text-app-text">
            
            {notification && (
              <div 
                className={`fixed top-4 left-1/2 transform -translate-x-1/2 max-w-md w-11/12 p-4 text-white text-center z-[100] shadow-lg text-lg rounded-md
                ${notification.type === 'success' ? 'bg-green-500' : ''}
                ${notification.type === 'error' ? 'bg-red-500' : ''}
                ${notification.type === 'info' ? 'bg-blue-500' : ''}`}
                role="alert"
                aria-live="assertive"
              >
                {notification.message}
                 <button 
                    onClick={() => setNotification(null)} 
                    className="absolute top-1 right-2 text-white hover:text-gray-200 text-2xl leading-none"
                    aria-label={t('close')}
                  >
                    &times;
                  </button>
              </div>
            )}

            <main className={`flex-grow container mx-auto max-w-4xl ${showBottomNav ? 'pb-20' : ''} ${notification ? 'pt-20 sm:pt-24' : 'pt-2 sm:pt-4'}`}>
              <Routes>
                <Route path="/" element={<LanguageSelectionPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/expenses/:expenseType" element={<ExpenseListPage />} />
                <Route path="/add/:expenseType" element={<AddExpensePage />} />
                <Route path="/edit/:expenseId" element={<AddExpensePage />} /> 
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/summary" element={<MonthlySummaryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={explicitlySetLang ? <HomePage /> : <LanguageSelectionPage />} />
              </Routes>
            </main>
            
            {showBottomNav && !isAddOrEditPage && <BottomNavigationBar />}
          </div>
        </NotificationContext.Provider>
      </ExpenseContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
