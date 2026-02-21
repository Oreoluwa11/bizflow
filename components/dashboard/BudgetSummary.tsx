import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";
import { FinanceData } from "@/types/finance";

interface BudgetSummaryProps {
  stats: {
    spendingByCategory: Record<string, number>;
    recommended: Record<string, number>;
  };
  rules: FinanceData["budgetRule"];
}

export function BudgetSummary({ stats, rules }: BudgetSummaryProps) {
  const categories = [
    {
      key: "needs",
      label: "Needs",
      color: "bg-emerald-500",
      text: "text-emerald-500",
    },
    {
      key: "wants",
      label: "Wants",
      color: "bg-indigo-500",
      text: "text-indigo-500",
    },
    {
      key: "savings",
      label: "Savings",
      color: "bg-rose-500",
      text: "text-rose-500",
    },
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {categories.map((cat) => {
        const spent = stats.spendingByCategory[cat.key] || 0;
        const recommended = stats.recommended[cat.key] || 0;
        const percentage = recommended > 0 ? (spent / recommended) * 100 : 0;
        const isOver = spent > recommended;

        return (
          <Card
            key={cat.key}
            className={cn(
              "relative overflow-hidden",
              isOver && "border-rose-500/30"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className={cn("text-sm font-medium", cat.text)}>
                {cat.label} ({rules[cat.key]}%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {formatCurrency(spent)}
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Target: {formatCurrency(recommended)}
              </p>
              <Progress
                value={spent}
                max={recommended}
                indicatorColor={cn(cat.color, isOver && "bg-rose-500")}
                className="h-1.5 bg-zinc-800"
              />
              <p className="mt-2 text-xs text-right text-zinc-500">
                {Math.round(percentage)}% used
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
