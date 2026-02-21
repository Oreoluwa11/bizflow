"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FinanceData } from "@/types/finance";

interface ChartsViewProps {
  expenses: FinanceData["expenses"];
}

export function ChartsView({ expenses }: ChartsViewProps) {
  const data = useMemo(() => {
    const counts = expenses.reduce(
      (acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      { name: "Needs", value: counts.needs || 0, color: "#10b981" }, // Emerald-500
      { name: "Wants", value: counts.wants || 0, color: "#6366f1" }, // Indigo-500
      { name: "Savings", value: counts.savings || 0, color: "#f43f5e" }, // Rose-500
    ].filter((i) => i.value > 0);
  }, [expenses]);

  if (expenses.length === 0) return null;

  return (
    <Card className="h-full min-h-[400px]">
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) =>
                  formatCurrency(value || 0)
                }
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#3f3f46",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
