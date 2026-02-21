"use client";

import { useFinance } from "@/lib/hooks/useFinance";
import { IncomeSection } from "@/components/dashboard/IncomeSection";
import { BudgetSummary } from "@/components/dashboard/BudgetSummary";
import { ChartsView } from "@/components/dashboard/ChartsView";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, ArrowRight } from "lucide-react";

import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useAuth } from "@/components/auth/AuthProvider";
import { User, LogIn } from "lucide-react";

export default function Home() {
  const { data, setIncome, stats } = useFinance();
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CircleDollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              BizFlow Finance
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Profile / Login Button */}
            <Link href={user ? "/profile" : "/login"}>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white"
              >
                {user ? (
                  <User className="w-5 h-5" />
                ) : (
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                {user ? "Profile" : "Login"}
              </Button>
            </Link>

            <Link href="/expenses">
              <Button
                variant="outline"
                className="text-indigo-400 border-indigo-500/30 hover:bg-zinc-800"
              >
                <ArrowRight className="h-4 w-4" />{" "}
                <span className="hidden sm:inline ml-2">Add Expenses</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Top Stats Row */}
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <IncomeSection
            income={data.monthlyIncome}
            onIncomeChange={setIncome}
          />
          <BudgetSummary stats={stats} rules={data.budgetRule} />
        </div>

        {/* Charts Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Financial Overview</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ChartsView expenses={data.expenses} />
            <IncomeChart
              expenses={data.expenses}
              monthlyIncome={data.monthlyIncome}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
