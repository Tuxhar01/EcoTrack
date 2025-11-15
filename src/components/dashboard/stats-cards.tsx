'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockEmissionStats } from '@/lib/data';
import { Footprints, Target, Calendar } from 'lucide-react';

export function StatsCards() {
  const weeklyGoal = 15; // kg CO2e
  const progress = (mockEmissionStats.weekly / weeklyGoal) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Daily Emissions (Yesterday)
          </CardTitle>
          <Footprints className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockEmissionStats.daily.toFixed(1)} kg CO₂e</div>
          <p className="text-xs text-muted-foreground">
            -15.2% from the day before
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Weekly Emissions
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockEmissionStats.weekly.toFixed(1)} kg CO₂e</div>
          <p className="text-xs text-muted-foreground">
            +5.1% from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{progress.toFixed(0)}%</div>
          <Progress value={progress} aria-label={`${progress.toFixed(0)}% of weekly goal`} />
        </CardContent>
      </Card>
    </div>
  );
}
