
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate, useParams, Link, useLocation as useReactRouterLocation, NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Language, Expense, ExpenseType, PaymentMethod } from '../types';
import { LanguageContext, ExpenseContext, NotificationContext } from '../App';
import { Button, Card, Modal, Input, Select, Toggle, DateTimePicker, Textarea, PageHeader } from './UIComponents';
import { ICONS, EXPENSE_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS, TRANSLATIONS } from '../constants';
import { t as translateUtil, formatDate, formatMonthYear, getCurrentMonthYear, exportToPdf, exportToExcel, exportAllDataToPdf, exportAllDataToExcel, generateId, formatSimpleDate } from '../utils';

export const LanguageSelectionPage: React.FC = () => {
  const { setLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();

  const selectLang = (lang: Language) => {
    setLanguage(lang);
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-app-bg">
      <h1 className="text-3xl font-bold mb-12 text-app-text text-center">Welcome / வரவேற்கிறோம்</h1>
      <h2 className="text-2xl mb-8 text-app-text text-center">{translateUtil('chooseLanguage', Language.EN)} / {translateUtil('chooseLanguage', Language.TA)}</h2>
      <div className="space-y-6 w-full max-w-xs">
        <Button onClick={() => selectLang(Language.EN)} size="lg" fullWidth variant="primary">
          {translateUtil('english', Language.EN)}
        </Button>
        <Button onClick={() => selectLang(Language.TA)} size="lg" fullWidth variant="primary">
          {translateUtil('tamil', Language.TA)}
        </Button>
      </div>
    </div>
  );
};

// --- Home Page Components ---
const ExpensesSummaryCard: React.FC = () => {
  const { language, t } = useContext(LanguageContext);
  const { expenses: allExpenses } = useContext(ExpenseContext);


  const todayExpenses = useMemo(() => {
    const todayStr = new Date().toDateString();
    return allExpenses
      .filter(exp => new Date(exp.date).toDateString() === todayStr)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [allExpenses]);

  const thisMonthExpenses = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return allExpenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [allExpenses]);

  return (
    <Card className="!p-5">
      <h2 className="text-xl font-semibold text-app-text mb-4">{t('expensesSummary')}</h2>
      <div className="flex justify-around items-center">
        <div className="text-center">
          <p className="text-app-secondary text-md mb-1">{t('today')}</p>
          <p className="text-2xl font-bold text-app-text">{t('rupeeSymbol')}{todayExpenses.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-app-secondary text-md mb-1">{t('thisMonth')}</p>
          <p className="text-2xl font-bold text-app-text">{t('rupeeSymbol')}{thisMonthExpenses.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};

const QuickActionItem: React.FC<{icon: React.ReactElement<{ className?: string }>, title: string, onClick: () => void}> = ({icon, title, onClick}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    className="flex items-center p-4 bg-gray-100 rounded-xl shadow-sm hover:bg-gray-200 cursor-pointer transition-colors active:bg-gray-300"
    aria-label={title}
  >
    {React.cloneElement(icon, {className: "w-7 h-7 text-app-text mr-4"})}
    <span className="text-lg font-medium text-app-text">{title}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-app-secondary ml-auto">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  </div>
);

const RecentTransactionsList: React.FC = () => {
  const { expenses } = useContext(ExpenseContext);
  const { language, t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const recentExpenses = expenses.slice(0, 5); // Already sorted by date in context

  if (recentExpenses.length === 0) {
    return (
      <Card className="text-center !p-6">
        <p className="text-lg text-app-secondary">{t('noTransactionsYet')}</p>
      </Card>
    );
  }
  
  const getExpenseTypeColor = (type: ExpenseType) => {
    switch(type) {
        case ExpenseType.DAILY: return 'bg-sky-500';
        case ExpenseType.CREDIT: return 'bg-amber-500';
        case ExpenseType.SPECIAL: return 'bg-emerald-500';
        default: return 'bg-gray-500';
    }
  }

  return (
    <div className="space-y-3">
      {recentExpenses.map(exp => (
        <Card key={exp.id} className="!p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 ${getExpenseTypeColor(exp.type)}`}></span>
            <div>
                <p className="text-lg font-medium text-app-text">{exp.purpose}</p>
                <p className="text-sm text-app-secondary">
                {formatSimpleDate(exp.date, language)} - {t(exp.type)}
                </p>
            </div>
          </div>
          <p className="text-lg font-semibold text-app-text whitespace-nowrap">{t('rupeeSymbol')}{exp.amount.toFixed(2)}</p>
        </Card>
      ))}
      {expenses.length > 5 && (
         <Button 
            variant="light-bg" 
            size="sm" 
            fullWidth 
            onClick={() => navigate('/summary')}
            className="mt-4 flex items-center justify-center !font-normal"
        >
            {t('viewAllTransactions')}
            {React.cloneElement(ICONS.viewAll, {className: "w-5 h-5 ml-1.5 text-app-secondary group-hover:text-app-text transition-colors"})}
        </Button>
      )}
    </div>
  );
};


export const HomePage: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const quickActionsList = [
    { titleKey: 'dailyExpense', icon: ICONS.plus, type: ExpenseType.DAILY },
    { titleKey: 'creditCardExpense', icon: ICONS.creditCard, type: ExpenseType.CREDIT },
    { titleKey: 'specialExpense', icon: ICONS.gift, type: ExpenseType.SPECIAL },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="pt-2 pb-0">
        <h1 className="text-3xl font-bold text-app-text">{t('appName')}</h1>
        <p className="text-lg text-app-secondary">{t('trackExpensesEasily')}</p>
      </header>

      <ExpensesSummaryCard />

      <div>
        <h2 className="text-xl font-semibold text-app-text mb-3">{t('quickActions')}</h2>
        <div className="space-y-3">
          {quickActionsList.map(action => (
            <QuickActionItem 
              key={action.titleKey}
              icon={action.icon}
              title={t(action.titleKey)}
              onClick={() => navigate(`/expenses/${action.type}`)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-app-text my-4">{t('recentTransactions')}</h2>
        <RecentTransactionsList />
      </div>
    </div>
  );
};

// --- Expense List Page ---
export const ExpenseListPage: React.FC = () => {
  const { expenseType } = useParams<{ expenseType: ExpenseType }>();
  const { expenses, deleteExpense } = useContext(ExpenseContext);
  const { language, t } = useContext(LanguageContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => exp.type === expenseType);
    // Expenses are already sorted by date in context
  }, [expenses, expenseType]);

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      showNotification(t('expenseDeleted'), 'success');
      setExpenseToDelete(null);
    }
  };
  
  const pageTitle = t('manageExpensesTitle', { expenseType: t(expenseType || 'expense') });
  const addNewButtonLabel = t('addNewExpenseType', { expenseType: t(expenseType || 'expense') });

  if (!expenseType) {
    navigate('/home'); // Should not happen if routes are correct
    return null;
  }

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <PageHeader title={pageTitle} />
      <div className="px-3 sm:px-0">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-app-secondary mb-6">{t('noExpensesOfType', { expenseType: t(expenseType) })}</p>
            <Button onClick={() => navigate(`/add/${expenseType}`)} size="lg" variant="primary" className="inline-flex items-center">
              {React.cloneElement(ICONS.plus, {className: "w-6 h-6 mr-2"})}
              {addNewButtonLabel}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredExpenses.map(exp => (
                <Card key={exp.id} className="!p-4 shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-3 sm:mb-0 flex-grow">
                          <p className="text-xl font-semibold text-app-text">{exp.purpose}</p>
                          <p className="text-md text-app-secondary">
                              {formatDate(exp.date, language, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-md text-app-secondary">
                              {t(exp.method.toLowerCase() as keyof typeof TRANSLATIONS, language) || exp.method}
                          </p>
                          {exp.notes && <p className="text-sm text-gray-600 mt-1 italic">"{exp.notes}"</p>}
                      </div>
                      <div className="flex flex-col items-end justify-between">
                          <p className="text-2xl font-bold text-app-text mb-2 sm:mb-0">{t('rupeeSymbol')}{exp.amount.toFixed(2)}</p>
                          <div className="flex space-x-2">
                              <Button variant="default" size="sm" onClick={() => navigate(`/edit/${exp.id}`)} aria-label={t('modify')}>
                                  {React.cloneElement(ICONS.edit, {className: "w-5 h-5 mr-1"})} {t('modify')}
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => setExpenseToDelete(exp)} aria-label={t('delete')}>
                                  {React.cloneElement(ICONS.trash, {className: "w-5 h-5 mr-1"})} {t('delete')}
                              </Button>
                          </div>
                      </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Show this button only if there are expenses listed */}
            <div className="mt-8 text-center">
                 <Button 
                    onClick={() => navigate(`/add/${expenseType}`)} 
                    size="lg" 
                    variant="primary"
                    className="inline-flex items-center shadow-xl"
                    aria-label={addNewButtonLabel}
                >
                   {React.cloneElement(ICONS.plus, {className: "w-6 h-6 mr-2"})}
                   {addNewButtonLabel}
                </Button>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        title={t('confirmDeleteExpense')}
      >
        <p className="text-lg text-app-text mb-6">{t('confirmDeleteExpense')}</p>
        <div className="flex justify-end space-x-4">
          <Button onClick={() => setExpenseToDelete(null)} variant="secondary">{t('cancel')}</Button>
          <Button onClick={handleDeleteConfirm} variant="danger">{t('confirm')}</Button>
        </div>
      </Modal>
    </div>
  );
};


export const AddExpensePage: React.FC = () => {
  const { language, t } = useContext(LanguageContext);
  const { addExpense, updateExpense, getExpenseById } = useContext(ExpenseContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { expenseType: expenseTypeParam, expenseId } = useParams<{ expenseType?: ExpenseType, expenseId?: string }>(); 
  
  const isEditMode = !!expenseId;
  const [existingExpense, setExistingExpense] = useState<Expense | null>(null);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 16)); 
  const [purpose, setPurpose] = useState('');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [notes, setNotes] = useState('');
  const [remindLater, setRemindLater] = useState(false);
  const [currentExpenseType, setCurrentExpenseType] = useState<ExpenseType>(expenseTypeParam || ExpenseType.DAILY);
  const [errors, setErrors] = useState<{[key:string]: string}>({});

  useEffect(() => {
    if (isEditMode && expenseId) {
      const foundExpense = getExpenseById(expenseId);
      if (foundExpense) {
        setExistingExpense(foundExpense);
        setAmount(foundExpense.amount.toString());
        setDate(new Date(foundExpense.date).toISOString().substring(0, 16));
        setPurpose(foundExpense.purpose);
        setMethod(foundExpense.method);
        setNotes(foundExpense.notes || '');
        setRemindLater(foundExpense.remindLater || false);
        setCurrentExpenseType(foundExpense.type);
      } else {
        showNotification(t('errorLoadingExpense'), 'error'); 
        navigate('/home');
      }
    } else if (expenseTypeParam) {
        setCurrentExpenseType(expenseTypeParam);
    }
  }, [expenseId, isEditMode, getExpenseById, navigate, showNotification, t, language, expenseTypeParam]);


  const validate = (): boolean => {
    const newErrors: {[key:string]: string} = {};
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = t('amountPositive');
    if (!purpose.trim()) newErrors.purpose = t('validationError'); 
    if (!date) newErrors.date = t('validationError');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showNotification(t('validationError'), 'error');
      return;
    }

    const expenseData = {
      type: currentExpenseType,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      purpose: purpose.trim(),
      method,
      notes: notes.trim(),
      remindLater,
    };

    if (isEditMode && existingExpense) {
      updateExpense(existingExpense.id, expenseData);
      showNotification(t('expenseUpdated'), 'success');
    } else {
      const newExpense: Expense = { ...expenseData, id: generateId() };
      addExpense(newExpense);
      showNotification(t('expenseSaved'), 'success');
    }
    navigate(`/expenses/${currentExpenseType}`); // Navigate to the list page of the current expense type
  };
  
  const translatedExpenseType = t(currentExpenseType);
  const pageTitle = isEditMode 
    ? t('editExpenseTitle', { expenseType: translatedExpenseType })
    : t('addExpenseTitle', { expenseType: translatedExpenseType });

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <PageHeader title={pageTitle} onBack={() => navigate(isEditMode && existingExpense ? `/expenses/${existingExpense.type}` : `/expenses/${currentExpenseType}`)} />
      <form onSubmit={handleSubmit} className="space-y-5 px-3 sm:px-0">
        {/* Expense Type Selector (only if not editing or if type needs to be changeable, for now fixed on edit) */}
        {!isEditMode && (
             <Select
                id="expenseType"
                label={t('type')}
                value={currentExpenseType}
                onChange={(e) => setCurrentExpenseType(e.target.value as ExpenseType)}
                options={EXPENSE_TYPE_OPTIONS.map(opt => ({value: opt.value, label: t(opt.labelKey)}))}
                // icon={ICONS.type} // Consider adding a type icon
            />
        )}

        <DateTimePicker
          id="date"
          label={t('dateAndTime')}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={ICONS.calendar}
          error={errors.date}
          required
        />
        <Input
          id="amount"
          label={`${t('amount')} (${t('rupeeSymbol')})`}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          icon={ICONS.amount}
          error={errors.amount}
          required
          min="0.01"
          step="0.01"
        />
        <Input
          id="purpose"
          label={t('purpose')}
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder={t('purpose')}
          icon={ICONS.purpose}
          error={errors.purpose}
          required
        />
        <Select
          id="method"
          label={t('paymentMethod')}
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          options={PAYMENT_METHOD_OPTIONS.map(opt => ({ value: opt.value, label: t(opt.labelKey) }))}
          icon={ICONS.paymentMethod}
        />
        <Textarea
          id="notes"
          label={t('optionalNotes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('optionalNotes')}
          icon={ICONS.notes}
        />
        <Toggle
          label={t('remindMeLater')}
          checked={remindLater}
          onChange={setRemindLater}
          icon={React.cloneElement(ICONS.reminder, {className: "w-6 h-6"})}
        />
        <Button type="submit" size="lg" fullWidth variant="primary">{t('save')}</Button>
      </form>
    </div>
  );
};

const MonthNavigator: React.FC<{currentMonth: Date, setCurrentMonth: (date: Date) => void, lang: Language}> = ({currentMonth, setCurrentMonth, lang}) => {
  const { t } = useContext(LanguageContext);
  const PaginatorButton: React.FC<{children: React.ReactNode, onClick: () => void, ariaLabel: string}> = ({children, onClick, ariaLabel}) => (
    <button 
      onClick={onClick} 
      className="p-3 text-xl bg-app-accent text-app-text rounded-lg shadow-md hover:bg-opacity-80 transition-colors"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-between mb-6 p-3 bg-gray-100 rounded-lg shadow mx-3 sm:mx-0">
      <PaginatorButton ariaLabel={t('goBack')} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>&lt;</PaginatorButton>
      <span className="text-xl font-semibold text-app-text">{formatMonthYear(currentMonth, lang)}</span>
      <PaginatorButton ariaLabel={t('goForward')} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>&gt;</PaginatorButton>
    </div>
  );
};


export const DashboardPage: React.FC = () => {
  const { language, t } = useContext(LanguageContext);
  const { expenses } = useContext(ExpenseContext);
  const navigate = useNavigate();
  
  const initialDate = useMemo(() => {
    const { month, year } = getCurrentMonthYear();
    return new Date(year, month, 1);
  }, []);

  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(initialDate);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getFullYear() === selectedMonthDate.getFullYear() && expDate.getMonth() === selectedMonthDate.getMonth();
    });
  }, [expenses, selectedMonthDate]);

  const summaryData = useMemo(() => {
    const daily = filteredExpenses.filter(e => e.type === ExpenseType.DAILY).reduce((sum, e) => sum + e.amount, 0);
    const credit = filteredExpenses.filter(e => e.type === ExpenseType.CREDIT).reduce((sum, e) => sum + e.amount, 0);
    const special = filteredExpenses.filter(e => e.type === ExpenseType.SPECIAL).reduce((sum, e) => sum + e.amount, 0);
    return { daily, credit, special, grandTotal: daily + credit + special };
  }, [filteredExpenses]);

  const chartData = useMemo(() => {
    return [
      { name: t('dailyExpense'), value: summaryData.daily },
      { name: t('creditCardExpense'), value: summaryData.credit },
      { name: t('specialExpense'), value: summaryData.special },
    ].filter(d => d.value > 0); 
  }, [summaryData, t]);

  const PIE_COLORS = ['#EEC1A0', '#F5B041', '#FAD7A0', '#FEF9E7'];

  const renderSummaryCard = (titleKey: string, amount: number, icon: React.ReactElement<{ className?: string }>) => (
    <Card className="text-center !p-4 shadow-md">
      <div className="text-app-accent mb-2">{React.cloneElement(icon, { className: "w-10 h-10 mx-auto text-app-accent" })}</div>
      <h3 className="text-lg font-medium text-app-text">{t(titleKey)}</h3>
      <p className="text-2xl font-bold text-app-text">{t('rupeeSymbol')}{amount.toFixed(2)}</p>
    </Card>
  );

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <PageHeader title={t('monthlyDashboard')} />
      <div className="px-3 sm:px-0">
        <MonthNavigator currentMonth={selectedMonthDate} setCurrentMonth={setSelectedMonthDate} lang={language} />

        {filteredExpenses.length === 0 ? (
          <p className="text-xl text-center text-app-secondary py-10">{t('noDataForMonth')}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {renderSummaryCard('totalDailyExpenses', summaryData.daily, ICONS.plus)}
              {renderSummaryCard('totalCreditCardExpenses', summaryData.credit, ICONS.creditCard)}
              {renderSummaryCard('totalSpecialExpenses', summaryData.special, ICONS.gift)}
              {renderSummaryCard('grandTotal', summaryData.grandTotal, ICONS.chart)}
            </div>

            {chartData.length > 0 && (
              <Card className="mb-8 !p-5 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-app-text text-center">{t('expensesByType')}</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { // removed index
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            return (
                                <text x={String(x)} y={String(y)} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14px">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            );
                        }}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${t('rupeeSymbol')}${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
            
            <Button onClick={() => navigate('/summary', { state: { month: selectedMonthDate.getMonth(), year: selectedMonthDate.getFullYear(), activeTab: 'all' } })} size="lg" fullWidth variant="primary">
              {t('goToSummary')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};


export const MonthlySummaryPage: React.FC = () => {
  const { language, t } = useContext(LanguageContext);
  const { expenses } = useContext(ExpenseContext);
  const { showNotification } = useContext(NotificationContext);
  const location = useReactRouterLocation(); 
  const routeState = location.state as { month: number; year: number, activeTab?: ExpenseType | 'all' } | undefined;

  const initialDate = useMemo(() => {
      const { month, year } = routeState || getCurrentMonthYear();
      return new Date(year, month, 1);
  }, [routeState]);
  
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(initialDate);
  const [activeTab, setActiveTab] = useState<ExpenseType | 'all'>(routeState?.activeTab || 'all');

  const TABS: { key: ExpenseType | 'all', labelKey: string }[] = [
    { key: 'all', labelKey: 'all' }, 
    { key: ExpenseType.DAILY, labelKey: 'daily' },
    { key: ExpenseType.CREDIT, labelKey: 'creditCard' },
    { key: ExpenseType.SPECIAL, labelKey: 'special' },
  ];

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getFullYear() === currentMonthDate.getFullYear() && expDate.getMonth() === currentMonthDate.getMonth();
      })
      .filter(exp => activeTab === 'all' || exp.type === activeTab);
      // Already sorted by date in context
  }, [expenses, currentMonthDate, activeTab]);

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (filteredExpenses.length === 0) {
      showNotification(t('noEntries'), 'info'); 
      return;
    }
    const dataToExport = {
      expenses: filteredExpenses,
      title: `${t('monthlySummaryForMonth', {month: formatMonthYear(currentMonthDate, language)})} - ${t(activeTab === 'all' ? 'all' : activeTab)}`,
      lang: language
    };
    const filename = `summary_${formatMonthYear(currentMonthDate, language).replace(/[^a-zA-Z0-9]/g, '_')}_${activeTab}`;

    try {
      if (format === 'pdf') {
        exportToPdf(dataToExport, filename);
      } else {
        exportToExcel(dataToExport, filename);
      }
      showNotification(t('dataExported'), 'success');
    } catch (error) {
      console.error("Export error:", error);
      showNotification(t('errorExportingData'), 'error');
    }
  };
  
  const totalForTab = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pageTitle = `${t('monthlySummaryTitle')} - ${formatMonthYear(currentMonthDate, language)}`;

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <PageHeader title={pageTitle} />
      <div className="px-3 sm:px-0">
        <MonthNavigator currentMonth={currentMonthDate} setCurrentMonth={setCurrentMonthDate} lang={language} />

        <div className="mb-6 border-b border-gray-300 flex space-x-1 overflow-x-auto pb-0 no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-lg font-medium rounded-t-lg transition-colors whitespace-nowrap focus:outline-none
                ${activeTab === tab.key 
                  ? 'border-b-4 border-app-accent text-app-accent bg-app-accent/10' 
                  : 'text-app-secondary hover:text-app-text hover:bg-gray-100'}`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="text-xl text-center text-app-secondary py-10">{t('noEntries')}</p>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map(exp => (
              <Card key={exp.id} className="!p-4 flex flex-col sm:flex-row justify-between sm:items-center shadow-md">
                <div className="mb-2 sm:mb-0 flex-grow">
                  <p className="text-lg font-semibold text-app-text">{exp.purpose}</p>
                  <p className="text-sm text-app-secondary">
                    {formatDate(exp.date, language)} 
                  </p>
                  <p className="text-sm text-app-secondary">
                    {t(exp.method.toLowerCase() as keyof typeof TRANSLATIONS, language) || exp.method} - <span className="font-medium">{t(exp.type)}</span>
                  </p>
                  {exp.notes && <p className="text-sm text-gray-600 mt-1 italic">"{exp.notes}"</p>}
                </div>
                <p className="text-xl font-bold text-app-text self-end sm:self-center ml-0 sm:ml-4 whitespace-nowrap">{t('rupeeSymbol')}{exp.amount.toFixed(2)}</p>
              </Card>
            ))}
            <Card className="!p-4 mt-6 bg-gray-100 shadow-md">
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-app-text">{t('grandTotal')} ({t(activeTab === 'all' ? 'all' : activeTab)})</p>
                <p className="text-2xl font-bold text-app-accent">{t('rupeeSymbol')}{totalForTab.toFixed(2)}</p>
              </div>
            </Card>
          </div>
        )}

        {filteredExpenses.length > 0 && (
          <div className="mt-8 space-y-3 md:space-y-0 md:space-x-4 md:flex">
            <Button onClick={() => handleExport('pdf')} variant="light-bg" fullWidth size="md" className="flex items-center justify-center">
              {React.cloneElement(ICONS.export, { className: "w-5 h-5 mr-2"})} {t('exportAsPDF')}
            </Button>
            <Button onClick={() => handleExport('excel')} variant="light-bg" fullWidth size="md" className="flex items-center justify-center">
              {React.cloneElement(ICONS.export, { className: "w-5 h-5 mr-2"})} {t('exportAsExcel')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useContext(LanguageContext);
  const { expenses, clearAllExpenses } = useContext(ExpenseContext);
  const { showNotification } = useContext(NotificationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === Language.EN ? Language.TA : Language.EN);
  };

  const handleExportAll = async (format: 'pdf' | 'excel') => {
     if (expenses.length === 0) {
      showNotification(t('noEntries'), 'info'); 
      return;
    }
    try {
      if (format === 'pdf') {
        exportAllDataToPdf(expenses, language);
      } else {
        exportAllDataToExcel(expenses, language);
      }
      showNotification(t('dataExported'), 'success');
    } catch (error) {
      console.error("Export all error:", error);
      showNotification(t('errorExportingData'), 'error');
    }
  };

  const handleClearData = () => {
    clearAllExpenses();
    setIsModalOpen(false);
    showNotification(t('dataCleared'), 'success');
  };

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <PageHeader title={t('settings')} />
      <div className="space-y-6 px-3 sm:px-0">
        <Card className="shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-app-text">{t('language')}</h2>
          <Button onClick={handleLanguageToggle} fullWidth variant="light-bg" size="md">
            {language === Language.EN ? t('tamil') : t('english')}
          </Button>
        </Card>

        <Card className="shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-app-text">{t('exportOptions')}</h2>
          <div className="space-y-3">
            <Button onClick={() => handleExportAll('pdf')} fullWidth variant="light-bg" size="md" >
              {React.cloneElement(ICONS.export, { className: "w-5 h-5 mr-2"})} {t('exportAllData')}
            </Button>
            <Button onClick={() => handleExportAll('excel')} fullWidth variant="light-bg" size="md">
              {React.cloneElement(ICONS.export, { className: "w-5 h-5 mr-2"})} {t('exportAllDataExcel')}
            </Button>
          </div>
        </Card>

        <Card className="shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-app-text">{t('clearAllData')}</h2>
          <Button onClick={() => setIsModalOpen(true)} variant="danger" fullWidth size="md">
            {React.cloneElement(ICONS.delete, { className: "w-5 h-5 mr-2"})} {t('clearAllData')}
          </Button>
        </Card>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('confirmClearAllData')}
      >
        <p className="text-lg text-app-text mb-6">{t('confirmClearAllData')}</p> {/* Text inside modal repeated from title for emphasis */}
        <div className="flex justify-end space-x-4">
          <Button onClick={() => setIsModalOpen(false)} variant="secondary">{t('cancel')}</Button>
          <Button onClick={handleClearData} variant="danger">{t('confirm')}</Button>
        </div>
      </Modal>
    </div>
  );
};

// Helper to hide scrollbar for horizontal tabs
const style = document.createElement('style');
style.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none; 
    scrollbar-width: none;  
  }
`;
document.head.append(style);
