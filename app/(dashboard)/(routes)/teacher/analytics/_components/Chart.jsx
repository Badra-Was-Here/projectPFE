"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export default function Chart({ data }) {
  return (
    <Card >
      <ResponsiveContainer  width="100%" height={350}>
        <BarChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip />
        
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={14}
            // tickLine={false}
            // axisLine={false}
          />
          <YAxis
            // stroke="#888888"
            // tickLine={false}
            // axisLine={false}
            // tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="total"
            fill="#0369a1"
            // barSize={120}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
