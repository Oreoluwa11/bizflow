import { useState, useMemo, useEffect } from 'react';
import { FinanceData, Expense, Goal, CategoryType } from '@/types/finance';

const DEFAULT_DATA: FinanceData = {
  monthlyIncome: 0,
  expenses: [],
  goals: [],
  budgetRule: [
    { id: 'needs', label: 'Needs', percentage: 50 },
    { id: 'wants', label: 'Wants', percentage: 30 },
    { id: 'savings', label: 'Savings', percentage: 10 },
    { id: 'investments', label: 'Investments', percentage: 10 },
  ],
};


export function useFinance() {
  const [data, setData] = useState<FinanceData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data (Local Storage)
  useEffect(() => {
    async function loadData() {
      const saved = localStorage.getItem('bizflow-data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
           if (parsed.expenses) {
               parsed.expenses = parsed.expenses.map((e: Partial<Expense>) => ({
                   ...e,
                   isPaid: e.isPaid ?? true, 
                   date: e.date ?? new Date().toISOString(),
               }));
          }
          if (parsed.budgetRule && !Array.isArray(parsed.budgetRule)) {
               parsed.budgetRule = [
                   { id: 'needs', label: 'Needs', percentage: parsed.budgetRule.needs || 50 },
                   { id: 'wants', label: 'Wants', percentage: parsed.budgetRule.wants || 30 },
                   { id: 'savings', label: 'Savings', percentage: parsed.budgetRule.savings || 20 },
               ];
          }
          setData(parsed);
        } catch (e) {
          console.error('Failed to load local data', e);
        }
      }
      setIsLoaded(true);
    }
    
    loadData();
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bizflow-data', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const setIncome = async (amount: number) => {
    setData((prev) => ({ ...prev, monthlyIncome: amount }));
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense = { 
    ...expense, 
    id: crypto.randomUUID(),
    isPaid: expense.isPaid ?? false,
    date: expense.date ?? new Date().toISOString()
    };
    setData((prev) => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const removeExpense = async (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  const toggleExpenseStatus = async (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => 
        e.id === id ? { ...e, isPaid: !e.isPaid } : e
      ),
    }));
  };

  const updateBudgetRule = async (rule: FinanceData['budgetRule']) => {
    setData((prev) => ({ ...prev, budgetRule: rule }));
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: crypto.randomUUID() };
    setData((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  // Calculations
  const stats = useMemo(() => {
    const paidExpenses = data.expenses.filter(e => e.isPaid);
    
    const totalExpenses = paidExpenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = data.monthlyIncome - totalExpenses;
    
    const spendingByCategory = paidExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<CategoryType, number>);

    const recommended = data.budgetRule.reduce((acc, rule) => {
      acc[rule.id] = (data.monthlyIncome * rule.percentage) / 100;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses,
      totalPlannedExpenses: data.expenses.reduce((sum, e) => sum + e.amount, 0),
      balance,
      spendingByCategory,
      recommended,
    };
  }, [data]);

  return {
    data,
    setIncome,
    addExpense,
    removeExpense,
    toggleExpenseStatus,
    updateBudgetRule,
    addGoal,
    stats,
  };
}
