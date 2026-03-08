import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, cn } from "@/lib/utils";
import { FinanceData, CategoryItem } from "@/types/finance";
import {
  Target,
  Heart,
  PiggyBank,
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BudgetSummaryProps {
  stats: {
    spendingByCategory: Record<string, number>;
    recommended: Record<string, number>;
  };
  rules: FinanceData["budgetRule"];
  onUpdateRules?: (rules: FinanceData["budgetRule"]) => void;
  isEditing?: boolean;
  onEditChange?: (isEditing: boolean) => void;
}

const COLOR_THEMES = [
  {
    color: "bg-emerald-500",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-gradient-to-br from-emerald-900/20 to-zinc-900/50",
    shadow: "shadow-emerald-500/5",
    Icon: Target,
  },
  {
    color: "bg-indigo-500",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    bg: "bg-gradient-to-br from-indigo-900/20 to-zinc-900/50",
    shadow: "shadow-indigo-500/5",
    Icon: Heart,
  },
  {
    color: "bg-rose-500",
    text: "text-rose-400",
    border: "border-rose-500/30",
    bg: "bg-gradient-to-br from-rose-900/20 to-zinc-900/50",
    shadow: "shadow-rose-500/5",
    Icon: PiggyBank,
  },
  {
    color: "bg-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-gradient-to-br from-amber-900/20 to-zinc-900/50",
    shadow: "shadow-amber-500/5",
    Icon: Target,
  },
  {
    color: "bg-cyan-500",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-gradient-to-br from-cyan-900/20 to-zinc-900/50",
    shadow: "shadow-cyan-500/5",
    Icon: Heart,
  },
];

export function BudgetSummary({
  stats,
  rules,
  onUpdateRules,
  isEditing,
  onEditChange,
}: BudgetSummaryProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const activeIsEditing =
    isEditing !== undefined ? isEditing : internalIsEditing;
  const [editRules, setEditRules] = useState<CategoryItem[]>(rules);
  const [newLabel, setNewLabel] = useState("");
  const [newPercentage, setNewPercentage] = useState("");

  const handleSave = () => {
    onUpdateRules?.(editRules);
    if (onEditChange) onEditChange(false);
    else setInternalIsEditing(false);
  };

  const handleCancel = () => {
    setEditRules(rules);
    if (onEditChange) onEditChange(false);
    else setInternalIsEditing(false);
  };

  const handleRemove = (id: string) => {
    setEditRules(editRules.filter((r) => r.id !== id));
  };

  const handleUpdatePercentage = (id: string, value: string) => {
    const num = Number(value);
    setEditRules(
      editRules.map((r) =>
        r.id === id ? { ...r, percentage: isNaN(num) ? 0 : num } : r,
      ),
    );
  };

  const handleAdd = () => {
    if (!newLabel || !newPercentage) return;
    const id = newLabel.toLowerCase().replace(/\s+/g, "-");
    if (editRules.some((r) => r.id === id)) return;
    const num = Number(newPercentage);
    setEditRules([
      ...editRules,
      { id, label: newLabel, percentage: isNaN(num) ? 0 : num },
    ]);
    setNewLabel("");
    setNewPercentage("");
  };

  if (activeIsEditing) {
    const totalPercentage = editRules.reduce((acc, r) => acc + r.percentage, 0);
    return (
      <Card className="w-full bg-zinc-900/50 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl text-white">Edit Categories</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 md:mr-2" />{" "}
              <span className="hidden md:inline">Cancel</span>
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSave}
            >
              <Check className="w-4 h-4 md:mr-2" />{" "}
              <span className="hidden md:inline">Save</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {editRules.map((rule) => (
              <div key={rule.id} className="flex gap-2 md:gap-3 items-center">
                <div className="flex-1">
                  <Input
                    value={rule.label}
                    disabled
                    className="bg-zinc-950/50 text-xs md:text-sm h-9"
                  />
                </div>
                <div className="w-20 md:w-24 relative">
                  <Input
                    type="number"
                    value={rule.percentage}
                    onChange={(e) =>
                      handleUpdatePercentage(rule.id, e.target.value)
                    }
                    className="pr-6 md:pr-8 bg-zinc-950/50 h-9"
                  />
                  <span className="absolute right-2 md:right-3 top-2 text-zinc-500 text-sm">
                    %
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-rose-500 hover:bg-rose-500/10"
                  onClick={() => handleRemove(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h4 className="text-sm font-medium mb-3 text-zinc-400">
              Add New Category
            </h4>
            <div className="flex gap-2 md:gap-3 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Name"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-zinc-950/50 h-9"
                />
              </div>
              <div className="w-20 md:w-24 relative">
                <Input
                  type="number"
                  placeholder="20"
                  value={newPercentage}
                  onChange={(e) => setNewPercentage(e.target.value)}
                  className="pr-6 md:pr-8 bg-zinc-950/50 h-9"
                />
                <span className="absolute right-2 md:right-3 top-2 text-zinc-500 text-sm">
                  %
                </span>
              </div>
              <Button
                size="icon"
                onClick={handleAdd}
                className="h-9 w-9 bg-zinc-800 hover:bg-zinc-700 text-white shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="pt-2 flex justify-between text-sm">
            <span className="text-zinc-500">Total Allocation:</span>
            <span
              className={cn(
                totalPercentage === 100
                  ? "text-emerald-400"
                  : "text-amber-400 font-medium",
              )}
            >
              {totalPercentage}%
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full">
      {onUpdateRules && isEditing === undefined && (
        <div className="absolute -top-11 right-0 md:-top-14 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditRules(rules);
              setInternalIsEditing(true);
            }}
            className="text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800 backdrop-blur"
          >
            <Pencil className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Edit Categories
          </Button>
        </div>
      )}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {rules.map((rule, index) => {
          const theme = COLOR_THEMES[index % COLOR_THEMES.length];
          const spent = stats.spendingByCategory[rule.id] || 0;
          const recommended = stats.recommended[rule.id] || 0;
          const percentage = recommended > 0 ? (spent / recommended) * 100 : 0;
          const isOver = spent > recommended;

          return (
            <Card
              key={rule.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-md",
                theme.bg,
                isOver ? "border-rose-500/50" : theme.border,
                theme.shadow,
              )}
            >
              <div
                className={cn(
                  "absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-50",
                  theme.color,
                )}
              />

              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 relative z-10">
                <CardTitle className={cn("text-sm font-medium", theme.text)}>
                  {rule.label} ({rule.percentage}%)
                </CardTitle>
                <theme.Icon className={cn("w-4 h-4 opacity-70", theme.text)} />
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
                  indicatorColor={cn(theme.color, isOver && "bg-rose-500")}
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
    </div>
  );
}
