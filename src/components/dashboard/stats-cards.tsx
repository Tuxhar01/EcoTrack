'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Footprints, Target, Calendar, PlusCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import Link from 'next/link';

interface StatsCardsProps {
    stats?: {
        daily: number;
        weekly: number;
        last_weekly: number;
    };
    weeklyGoal?: number;
    isLoading: boolean;
}

export function StatsCards({ stats, weeklyGoal, isLoading }: StatsCardsProps) {
  const progress = weeklyGoal && stats ? (stats.weekly / weeklyGoal) * 100 : 0;
  const dailyDiff = stats ? ((stats.daily - 5) / 5) * 100 : 0; // Mocked previous day
  const weeklyDiff = stats && stats.last_weekly > 0 ? ((stats.weekly - stats.last_weekly) / stats.last_weekly) * 100 : (stats ? 100 : 0);


  if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Emissions (Yesterday)</CardTitle>
                    <Footprints className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Emissions</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

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
          <div className="text-2xl font-bold">{stats?.daily.toFixed(1)} kg CO₂e</div>
          <p className="text-xs text-muted-foreground">
             {dailyDiff.toFixed(1)}% from the day before
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
          <div className="text-2xl font-bold">{stats?.weekly.toFixed(1)} kg CO₂e</div>
          <p className="text-xs text-muted-foreground">
            {weeklyDiff >= 0 ? '+' : ''}{weeklyDiff.toFixed(1)}% from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {weeklyGoal ? (
                <>
                    <div className="text-2xl font-bold mb-2">{progress.toFixed(0)}%</div>
                    <Progress value={progress} aria-label={`${progress.toFixed(0)}% of weekly goal`} />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 pt-2">
                    <p className="text-sm text-muted-foreground">No active goal set.</p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/goals"><PlusCircle className="mr-2 h-4 w-4" />Set Weekly Goal</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
