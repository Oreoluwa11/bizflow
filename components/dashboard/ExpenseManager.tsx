import { useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatCurrency, cn } from "@/lib/utils";
import { Expense, CategoryType } from "@/types/finance";

interface ExpenseManagerProps {
  expenses: Expense[];
  onAdd: (expense: Omit<Expense, "id">) => void;
  onRemove: (id: string) => void;
  hideList?: boolean;
}

export function ExpenseManager({
  expenses,
  onAdd,
  onRemove,
  hideList = false,
}: ExpenseManagerProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryType>("needs");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onAdd({
      name,
      amount: parseFloat(amount),
      category,
      isFixed: false,
      isPaid: false,
      date: new Date().toISOString(),
    });

    setName("");
    setAmount("");
  };

  return (
    <div
      className={cn(
        "grid gap-6",
        hideList ? "" : "md:grid-cols-2 lg:h-[500px]"
      )}
    >
      {/* Add Expense Form */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Rent, Groceries, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
              >
                <option value="needs">Needs (Essential)</option>
                <option value="wants">Wants (Lifestyle)</option>
                <option value="savings">Savings (Future)</option>
              </select>
            </div>
            <Button type="submit" className="w-full mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Expense List */}
      {!hideList && (
        <Card
          className="flex flex-col h-full opacity-0 animate-in fade-in duration-700 slide-in-from-bottom-4"
          style={{ animationFillMode: "forwards", animationDelay: "100ms" }}
        >
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">
                  <p>No expenses yet.</p>
                </div>
              ) : (
                expenses
                  .slice()
                  .reverse()
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="group flex items-center justify-between p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full bg-opacity-10",
                            expense.category === "needs" &&
                              "bg-emerald-500/10 text-emerald-500",
                            expense.category === "wants" &&
                              "bg-indigo-500/10 text-indigo-500",
                            expense.category === "savings" &&
                              "bg-rose-500/10 text-rose-500"
                          )}
                        >
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200">
                            {expense.name}
                          </p>
                          <p className="text-xs text-zinc-500 capitalize">
                            {expense.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-zinc-100">
                          {formatCurrency(expense.amount)}
                        </span>
                        <button
                          onClick={() => onRemove(expense.id)}
                          className="text-zinc-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
