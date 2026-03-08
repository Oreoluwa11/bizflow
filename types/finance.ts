export type CategoryType = string;

export interface CategoryItem {
  id: string;
  label: string;
  percentage: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  isFixed: boolean;
  isPaid: boolean;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface FinanceData {
  monthlyIncome: number;
  expenses: Expense[];
  goals: Goal[];
  budgetRule: CategoryItem[];
}
