'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { mockChartData } from '@/lib/data';

const chartConfig = {
  transport: {
    label: 'Transport',
    color: 'hsl(var(--chart-1))',
  },
  energy: {
    label: 'Energy',
    color: 'hsl(var(--chart-2))',
  },
  food: {
    label: 'Food',
    color: 'hsl(var(--chart-3))',
  },
};

export function EmissionsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emission Breakdown</CardTitle>
        <CardDescription>This week vs. last week (kg CO₂e)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={mockChartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="transport" fill="var(--color-transport)" radius={4} />
            <Bar dataKey="energy" fill="var(--color-energy)" radius={4} />
            <Bar dataKey="food" fill="var(--color-food)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
