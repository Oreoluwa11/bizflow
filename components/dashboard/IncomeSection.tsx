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
    <Card className="bg-gradient-to-br from-indigo-900/40 via-indigo-900/10 to-zinc-900/50 border-indigo-500/30 shadow-lg shadow-indigo-500/10 relative overflow-hidden group transition-all duration-500 hover:shadow-indigo-500/20">
      {/* Decorative blurred circle */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500" />
      <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all duration-500" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-5">
        <CardTitle className="text-sm font-medium text-indigo-300 tracking-wide uppercase">
          Monthly Income
        </CardTitle>
        <div className="p-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <Wallet className="h-4 w-4 text-indigo-400" />
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 relative z-10">
        <div className="flex flex-col gap-1">
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg font-medium">
                  ₦
                </span>
                <Input
                  ref={inputRef}
                  type="number"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  className="pl-9 bg-black/40 border-indigo-500/30 text-lg h-12 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 transition-all rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
              </div>
              <Button
                size="icon"
                onClick={handleSave}
                className="h-12 w-12 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 shrink-0 transition-colors rounded-xl"
              >
                <Check className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                className="h-12 w-12 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 shrink-0 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-end justify-between mt-1 group/edit">
              <div className="text-4xl md:text-5xl font-bold text-white tracking-tight font-sans drop-shadow-md">
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
                className="ml-auto border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-all opacity-100 md:opacity-0 md:group-hover/edit:opacity-100 rounded-lg px-4"
              >
                <Edit2 className="h-3.5 w-3.5 mr-2" />
                Update
              </Button>
            </div>
          )}

          <p className="text-sm text-indigo-200/50 font-medium mt-3 flex items-center gap-2">
            {isEditing ? (
              <span className="animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Press Enter to save
              </span>
            ) : (
              "Total monthly budget source"
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
