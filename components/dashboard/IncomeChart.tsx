"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FinanceData } from "@/types/finance";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

interface IncomeChartProps {
  expenses: FinanceData["expenses"];
  monthlyIncome: number;
}

export function IncomeChart({ expenses, monthlyIncome }: IncomeChartProps) {
  const data = useMemo(() => {
    // Generate last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i); // 5 months ago to now
      return {
        name: format(date, "MMM"),
        fullName: format(date, "MMMM yyyy"),
        start: startOfMonth(date),
        end: endOfMonth(date),
        income: monthlyIncome, // Assuming constant income for MVP
        spent: 0,
      };
    });

    // Populate spending
    expenses.forEach((exp) => {
      if (!exp.isPaid) return; // Only count paid expenses? Or all? Let's assume Paid for "Actuals"
      const expDate = new Date(exp.date);
      const month = months.find((m) =>
        isWithinInterval(expDate, { start: m.start, end: m.end })
      );
      if (month) {
        month.spent += exp.amount;
      }
    });

    return months;
  }, [expenses, monthlyIncome]);

  return (
    <Card className="h-full min-h-[400px]">
      <CardHeader>
        <CardTitle>Income vs Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${value / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "#3f3f46", opacity: 0.4 }}
                formatter={(value: any) => formatCurrency(value)}
                labelFormatter={(label, payload) =>
                  payload[0]?.payload?.fullName || label
                }
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#3f3f46",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend iconType="circle" />
              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="spent"
                name="Spent"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
