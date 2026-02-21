import { createClient } from '@/lib/supabase/client';
import { Expense, Goal } from '@/types/finance';

const supabase = createClient();

// Helper types for DB rows
interface DBExpense {
  id: string;
  name: string;
  amount: number;
  category: Expense['category'];
  is_fixed: boolean | null;
  is_paid: boolean | null;
  date: string;
}

interface DBGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number | null;
}

// Helper to map DB snake_case to app camelCase
const mapExpenseFromDB = (data: DBExpense): Expense => ({
  id: data.id,
  name: data.name,
  amount: Number(data.amount),
  category: data.category,
  isFixed: data.is_fixed || false,
  isPaid: data.is_paid || false,
  date: data.date,
});

const mapGoalFromDB = (data: DBGoal): Goal => ({
  id: data.id,
  name: data.name,
  targetAmount: Number(data.target_amount),
  currentAmount: Number(data.current_amount || 0),
});

export const dbRequest = {
  // Expenses
  async getExpenses() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    return data.map(mapExpenseFromDB);
  },

  async addExpense(expense: Omit<Expense, 'id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.from('expenses').insert({
      user_id: user.id,
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      is_fixed: expense.isFixed,
      is_paid: expense.isPaid,
      date: expense.date,
    }).select().single();

    if (error) throw error;
    return mapExpenseFromDB(data);
  },

  async deleteExpense(id: string) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },

  async updateExpenseStatus(id: string, isPaid: boolean) {
    const { error } = await supabase
      .from('expenses')
      .update({ is_paid: isPaid })
      .eq('id', id);
    if (error) throw error;
  },

  // Goals
  async getGoals() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (error) return [];
    return data.map(mapGoalFromDB);
  },

  async addGoal(goal: Omit<Goal, 'id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.from('goals').insert({
      user_id: user.id,
      name: goal.name,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
    }).select().single();

    if (error) throw error;
    return mapGoalFromDB(data);
  },
  
  // Profile / Settings (for Income)
  async getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
  },
  
  // Since we didn't add income to profiles table, we might need to add it or store it in metadata
  // For now let's just use metadata or a new column. 
  // Let's UPDATE the profile table schema via SQL to include income?
  // Or just trust local storage for income for a moment? 
  // The user asked for "profile using supabase", usually implies storing user data.
  // Let's assume income is part of the "Finance Logic" that should be in DB.
  // I will add a method to update profile metadata or just use `auth.users` metadata for now to save SQL migration hassle 
  // until I can confirm user wants to run more SQL.
  async setIncome(amount: number) {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) return;
     
     await supabase.auth.updateUser({
         data: { monthly_income: amount }
     });
  },

  async getIncome() {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.user_metadata?.monthly_income || 0;
  }
};
