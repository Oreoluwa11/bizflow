import { useState, useMemo, useEffect } from 'react';
import { FinanceData, Expense, Goal, CategoryType } from '@/types/finance';
import { createClient } from '@/lib/supabase/client';
import { dbRequest } from '@/lib/finance-db';

const DEFAULT_DATA: FinanceData = {
  monthlyIncome: 0,
  expenses: [],
  goals: [],
  budgetRule: {
    needs: 50,
    wants: 30,
    savings: 20,
  },
};


export function useFinance() {
  const [data, setData] = useState<FinanceData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Check auth status
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Load data (Local Storage OR Supabase)
  useEffect(() => {
    async function loadData() {
      if (user) {
        // Load from Supabase
        try {
          const [expenses, goals, income] = await Promise.all([
            dbRequest.getExpenses(),
            dbRequest.getGoals(),
            dbRequest.getIncome()
          ]);
          
          setData(prev => ({
            ...prev,
            expenses,
            goals,
            monthlyIncome: income
          }));
        } catch (e) {
          console.error("Failed to sync with Supabase", e);
        }
      } else {
        // Load from Local Storage (Guest)
        const saved = localStorage.getItem('bizflow-data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Migration
             if (parsed.expenses) {
                 parsed.expenses = parsed.expenses.map((e: any) => ({
                     ...e,
                     isPaid: e.isPaid ?? true, 
                     date: e.date ?? new Date().toISOString(),
                 }));
            }
            setData(parsed);
          } catch (e) {
            console.error('Failed to load local data', e);
          }
        }
      }
      setIsLoaded(true);
    }
    
    loadData();
  }, [user]);

  // Save to local storage for guests ONLY
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem('bizflow-data', JSON.stringify(data));
    }
  }, [data, isLoaded, user]);

  const setIncome = async (amount: number) => {
    setData((prev) => ({ ...prev, monthlyIncome: amount }));
    if (user) await dbRequest.setIncome(amount);
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (user) {
       try {
           const newExpense = await dbRequest.addExpense(expense);
           setData((prev) => ({ ...prev, expenses: [newExpense, ...prev.expenses] })); // Add to top
       } catch (e) {
           console.error(e);
       }
    } else {
        const newExpense = { 
        ...expense, 
        id: crypto.randomUUID(),
        isPaid: expense.isPaid ?? false,
        date: expense.date ?? new Date().toISOString()
        };
        setData((prev) => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    }
  };

  const removeExpense = async (id: string) => {
    if (user) {
        await dbRequest.deleteExpense(id);
    }
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

    const toggleExpenseStatus = async (id: string) => {
    const expense = data.expenses.find(e => e.id === id);
    if (expense && user) {
        await dbRequest.updateExpenseStatus(id, !expense.isPaid);
    }

    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => 
        e.id === id ? { ...e, isPaid: !e.isPaid } : e
      ),
    }));
  };

  const updateBudgetRule = (rule: FinanceData['budgetRule']) => {
    setData((prev) => ({ ...prev, budgetRule: rule }));
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    if (user) {
        const newGoal = await dbRequest.addGoal(goal);
        setData((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
    } else {
        const newGoal = { ...goal, id: crypto.randomUUID() };
        setData((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
    }
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

    const recommended = {
      needs: (data.monthlyIncome * data.budgetRule.needs) / 100,
      wants: (data.monthlyIncome * data.budgetRule.wants) / 100,
      savings: (data.monthlyIncome * data.budgetRule.savings) / 100,
    };

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
