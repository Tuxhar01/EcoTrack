
'use client';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { EmissionsChart } from '@/components/dashboard/emissions-chart';
import { GamificationPanel } from '@/components/dashboard/gamification-panel';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Activity, WeeklyGoal } from '@/lib/types';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeDeciduous } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const activitiesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'activities'));
  }, [user, firestore]);

  const { data: activities, isLoading: isLoadingActivities } = useCollection<Activity>(activitiesQuery);
  
  const weeklyGoalsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'weeklyGoals'),
      where('status', '==', 'active'),
    );
  }, [user, firestore]);

  const { data: weeklyGoals, isLoading: isLoadingGoals } = useCollection<WeeklyGoal>(weeklyGoalsQuery);
  const activeGoal = weeklyGoals?.[0];

  const { stats, chartData, totalEmissions } = useMemo(() => {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
    const startOfLastWeek = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
    const endOfLastWeek = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
    const yesterday = subDays(now, 1);

    const initialStats = { daily: 0, weekly: 0, last_weekly: 0 };
    const initialChartData = { transport: 0, energy: 0, food: 0 };
    let totalEmissions = 0;

    if (!activities) {
      return {
        stats: initialStats,
        chartData: initialChartData,
        totalEmissions,
      };
    }

    const calculatedData = activities.reduce(
      (acc, activity) => {
        // Firestore timestamps can be objects with toDate(), so we need to handle that
        const activityDate = activity.date?.toDate ? activity.date.toDate() : new Date(activity.date);

        acc.totalEmissions += activity.co2e;

        // Daily
        if (activityDate.toDateString() === yesterday.toDateString()) {
          acc.stats.daily += activity.co2e;
        }

        // This Week
        if (activityDate >= startOfThisWeek && activityDate <= endOfThisWeek) {
          acc.stats.weekly += activity.co2e;
          if (activity.category === 'travel') acc.chartData.transport += activity.co2e;
          if (activity.category === 'household') acc.chartData.energy += activity.co2e;
          if (activity.category === 'food') acc.chartData.food += activity.co2e;
        }

        // Last Week
        if (activityDate >= startOfLastWeek && activityDate <= endOfLastWeek) {
          acc.stats.last_weekly += activity.co2e;
        }

        return acc;
      },
      { stats: initialStats, chartData: initialChartData, totalEmissions: 0 }
    );

    return {
      stats: calculatedData.stats,
      chartData: calculatedData.chartData,
      totalEmissions: calculatedData.totalEmissions,
    };
  }, [activities]);

  const displayName = user?.displayName?.split(' ')[0] || 'User';

  const treesNeeded = useMemo(() => {
    const co2PerTreePerYear = 22; // kg
    if (totalEmissions === 0) return 0;
    return totalEmissions / co2PerTreePerYear;
  }, [totalEmissions]);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          Welcome back, {displayName}!
        </h1>
      </div>
      <StatsCards stats={stats} weeklyGoal={activeGoal} isLoading={isLoadingActivities || isLoadingGoals} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-4">
           <EmissionsChart {...chartData} />
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5" />
                    Environmental Outcome
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{treesNeeded.toFixed(2)} trees</div>
              <p className="text-xs text-muted-foreground">
                are needed to absorb your total logged emissions of {totalEmissions.toFixed(2)} kg CO₂e over one year.
              </p>
            </CardContent>
          </Card>
        </div>
        <GamificationPanel />
      </div>
    </main>
  );
}
