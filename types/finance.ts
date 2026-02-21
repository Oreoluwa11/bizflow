
export type CategoryType = 'needs' | 'wants' | 'savings';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: CategoryType;
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
  budgetRule: {
    needs: number; // percentage
    wants: number; // percentage
    savings: number; // percentage
  };
}
