import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Expense } from "@/types/finance";

interface ExpenseTableProps {
  expenses: Expense[];
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ExpenseTable({
  expenses,
  onToggleStatus,
  onRemove,
}: ExpenseTableProps) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <TableHead className="text-zinc-400 w-[100px]">Status</TableHead>
            <TableHead className="text-zinc-400">Date</TableHead>
            <TableHead className="text-zinc-400">Expense Name</TableHead>
            <TableHead className="text-zinc-400">Category</TableHead>
            <TableHead className="text-right text-zinc-400">Amount</TableHead>
            <TableHead className="text-right text-zinc-400 w-[100px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                No expenses recorded.
              </TableCell>
            </TableRow>
          ) : (
            expenses
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((expense) => (
                <TableRow
                  key={expense.id}
                  className="border-zinc-800 hover:bg-zinc-900/30"
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(expense.id)}
                      className={cn(
                        "h-8 gap-2 border",
                        expense.isPaid
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
                          : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                      )}
                    >
                      {expense.isPaid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Paid
                        </>
                      ) : (
                        <>
                          <div className="h-4 w-4 rounded-full border border-zinc-500" />{" "}
                          Unpaid
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium text-zinc-200">
                    {expense.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize border-0",
                        expense.category === "needs" &&
                          "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
                        expense.category === "wants" &&
                          "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
                        expense.category === "savings" &&
                          "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      )}
                    >
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-zinc-100">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(expense.id)}
                      className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
