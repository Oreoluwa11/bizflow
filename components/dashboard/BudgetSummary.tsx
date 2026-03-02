import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";
import { FinanceData } from "@/types/finance";
import { Target, Heart, PiggyBank } from "lucide-react";

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
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-gradient-to-br from-emerald-900/20 to-zinc-900/50",
      shadow: "shadow-emerald-500/5",
      Icon: Target,
    },
    {
      key: "wants",
      label: "Wants",
      color: "bg-indigo-500",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      bg: "bg-gradient-to-br from-indigo-900/20 to-zinc-900/50",
      shadow: "shadow-indigo-500/5",
      Icon: Heart,
    },
    {
      key: "savings",
      label: "Savings",
      color: "bg-rose-500",
      text: "text-rose-400",
      border: "border-rose-500/30",
      bg: "bg-gradient-to-br from-rose-900/20 to-zinc-900/50",
      shadow: "shadow-rose-500/5",
      Icon: PiggyBank,
    },
  ] as const;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {categories.map((cat) => {
        const spent = stats.spendingByCategory[cat.key] || 0;
        const recommended = stats.recommended[cat.key] || 0;
        const percentage = recommended > 0 ? (spent / recommended) * 100 : 0;
        const isOver = spent > recommended;

        return (
          <Card
            key={cat.key}
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-md",
              cat.bg,
              isOver ? "border-rose-500/50" : cat.border,
              cat.shadow,
            )}
          >
            {/* Subtle glow effect */}
            <div
              className={cn(
                "absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-50",
                cat.color,
              )}
            />

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 relative z-10">
              <CardTitle className={cn("text-sm font-medium", cat.text)}>
                {cat.label} ({rules[cat.key]}%)
              </CardTitle>
              <cat.Icon className={cn("w-4 h-4 opacity-70", cat.text)} />
            </CardHeader>
            <CardContent className="p-4 pt-0 relative z-10">
              <div className="text-2xl font-bold text-white mb-1">
                {formatCurrency(spent)}
              </div>
              <p className="text-xs text-zinc-400 mb-3 font-medium">
                Target: {formatCurrency(recommended)}
              </p>
              <Progress
                value={spent}
                max={recommended}
                indicatorColor={cn(cat.color, isOver && "bg-rose-500")}
                className="h-2 bg-black/40 border border-white/5"
              />
              <p className="mt-2 text-xs text-right text-zinc-400 font-medium tracking-wide">
                <span
                  className={cn(isOver ? "text-rose-400" : "text-zinc-200")}
                >
                  {Math.round(percentage)}%
                </span>{" "}
                used
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
