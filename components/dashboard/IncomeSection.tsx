import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Edit2, Check, X } from "lucide-react";

interface IncomeSectionProps {
  income: number;
  onIncomeChange: (amount: number) => void;
}

export function IncomeSection({ income, onIncomeChange }: IncomeSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempIncome, setTempIncome] = useState(income.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempIncome(income.toString());
  }, [income]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const val = parseFloat(tempIncome);
    if (!isNaN(val)) {
      onIncomeChange(val);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempIncome(income.toString());
    setIsEditing(false);
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/20 to-zinc-900/50 border-indigo-500/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-indigo-400">
          Monthly Income
        </CardTitle>
        <Wallet className="h-4 w-4 text-indigo-400" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg font-medium">
                  ₦
                </span>
                <Input
                  ref={inputRef}
                  type="number"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  className="pl-8 bg-zinc-800/50 border-zinc-700 text-lg h-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
              </div>
              <Button
                size="icon"
                onClick={handleSave}
                className="h-12 w-12 bg-emerald-600 hover:bg-emerald-500 shrink-0"
              >
                <Check className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                className="h-12 w-12 text-zinc-400 hover:text-white shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-end justify-between mt-1">
              <div className="text-3xl font-bold text-white tracking-tight">
                {income > 0 ? (
                  formatCurrency(income)
                ) : (
                  <span className="text-zinc-600">₦0.00</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="ml-auto border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 hover:text-indigo-200"
              >
                <Edit2 className="h-3 w-3 mr-2" />
                Update
              </Button>
            </div>
          )}

          <p className="text-xs text-zinc-500 mt-2">
            {isEditing ? "Press Enter to save" : "Total monthly budget source"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
