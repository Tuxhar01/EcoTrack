'use client';

import { Pie, PieChart, Tooltip } from 'recharts';
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
import { useMemo } from 'react';

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

interface EmissionsPieChartProps {
    transport: number;
    energy: number;
    food: number;
}

export function EmissionsChart({ transport, energy, food }: EmissionsPieChartProps) {
  const chartData = useMemo(() => [
      { name: 'Transport', value: transport, fill: 'var(--color-transport)' },
      { name: 'Energy', value: energy, fill: 'var(--color-energy)' },
      { name: 'Food', value: food, fill: 'var(--color-food)' },
  ], [transport, energy, food]);
    
  const totalEmissions = transport + energy + food;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emission Breakdown</CardTitle>
        <CardDescription>This week's emissions by category (kg CO₂e)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            {totalEmissions > 0 ? (
                <PieChart accessibilityLayer>
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                    }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                        if (percent < 0.05) return null; // Don't render label for small slices

                        return (
                        <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            className="text-xs font-bold"
                        >
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                        );
                    }}
                    />
                </PieChart>
            ) : (
                <div className="flex justify-center items-center h-full min-h-[200px]">
                    <p className="text-muted-foreground">Log some activities to see your emission breakdown.</p>
                </div>
            )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
