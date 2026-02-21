"use client";

import { useFinance } from "@/lib/hooks/useFinance";
import { ExpenseTable } from "@/components/dashboard/ExpenseTable";
import { ExpenseManager } from "@/components/dashboard/ExpenseManager";
import { IncomeSection } from "@/components/dashboard/IncomeSection";
import { BudgetSummary } from "@/components/dashboard/BudgetSummary";
import { GoalTracker } from "@/components/dashboard/GoalTracker";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { User, LogIn } from "lucide-react";
import Link from "next/link";

export default function ExpensesPage() {
  const {
    data,
    addExpense,
    removeExpense,
    toggleExpenseStatus,
    setIncome,
    stats,
    addGoal,
  } = useFinance();
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Expense Tracker
              </h1>
            </div>
          </div>

          <Link href={user ? "/profile" : "/login"}>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              {user ? (
                <User className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {user ? "Profile" : "Login"}
            </Button>
          </Link>
        </header>

        {/* Dashboard Stats */}
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <IncomeSection
            income={data.monthlyIncome}
            onIncomeChange={setIncome}
          />
          <BudgetSummary stats={stats} rules={data.budgetRule} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          {/* Left Column: Add Expense Form */}
          <div className="space-y-6">
            <div className="sticky top-8 space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 text-zinc-200">
                  New Transaction
                </h2>
                <ExpenseManager
                  expenses={[]}
                  onAdd={addExpense}
                  onRemove={() => {}}
                  hideList={true}
                />
              </div>

              <GoalTracker goals={data.goals} onAddGoal={addGoal} />
            </div>
          </div>

          {/* Right Column: Detailed Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-200">
                Transaction History
              </h2>
              <div className="text-sm text-zinc-400">
                {data.expenses.length} records found
              </div>
            </div>
            <ExpenseTable
              expenses={data.expenses}
              onToggleStatus={toggleExpenseStatus}
              onRemove={removeExpense}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
