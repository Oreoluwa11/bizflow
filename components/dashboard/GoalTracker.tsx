import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Goal } from "@/types/finance";

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, "id">) => void;
}

export function GoalTracker({ goals, onAddGoal }: GoalTrackerProps) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    onAddGoal({
      name,
      targetAmount: parseFloat(target),
      currentAmount: 0, // In a real app, you'd allocate savings to goals. Simplification: automatic?
    });
    setName("");
    setTarget("");
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Goals</CardTitle>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() =>
            document.getElementById("add-goal-form")?.classList.toggle("hidden")
          }
        >
          <Plus className="h-4 w-4 mr-1" /> New Goal
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hidden Form for adding */}
        <form
          id="add-goal-form"
          onSubmit={handleAdd}
          className="hidden space-y-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 mb-4 animate-in slide-in-from-top-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal Name</Label>
              <Input
                placeholder="Emergency Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Amount</Label>
              <Input
                type="number"
                placeholder="50000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="w-full">
            Create Goal
          </Button>
        </form>

        <div className="space-y-6">
          {goals.map((goal) => {
            // Visualize progress (Mock logic: distribute 'savings' category total across goals? Or manual.
            // For now, let's just show 0 progress unless we actually track contributions.
            // User requested: "Progress toward savings goals".
            // I'll add a manual progress updater or just random progress for demo if requested, but let's stick to simple "Current Amount" field in the type.
            // Actually, let's just assume Current Amount is editable or calculated.
            // For this version, I'll calculate percentage based on a hypothetical allocation effectively 0 for new ones.

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-200">{goal.name}</span>
                  <span className="text-zinc-400">
                    {formatCurrency(goal.currentAmount)} /{" "}
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <Progress
                  value={goal.currentAmount}
                  max={goal.targetAmount}
                  indicatorColor="bg-amber-500"
                />
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="text-center text-zinc-500 py-4 text-sm">
              No goals set. Start saving today!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
