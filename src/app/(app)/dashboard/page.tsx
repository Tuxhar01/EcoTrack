
'use client';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { EmissionsChart } from '@/components/dashboard/emissions-chart';
import { GamificationPanel } from '@/components/dashboard/gamification-panel';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Activity, WeeklyGoal } from '@/lib/types';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';

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

  const { stats, chartData } = useMemo(() => {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
    const startOfLastWeek = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
    const endOfLastWeek = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
    const yesterday = subDays(now, 1);

    const initialStats = { daily: 0, weekly: 0, last_weekly: 0 };
    const initialChartData = {
      thisWeek: { transport: 0, energy: 0, food: 0 },
      lastWeek: { transport: 0, energy: 0, food: 0 },
    };

    if (!activities) {
      return {
        stats: initialStats,
        chartData: [
          { name: 'Last Wk', ...initialChartData.lastWeek },
          { name: 'This Wk', ...initialChartData.thisWeek },
        ],
      };
    }

    const calculatedStats = activities.reduce(
      (acc, activity) => {
        // Firestore timestamps can be objects with toDate(), so we need to handle that
        const activityDate = activity.date?.toDate ? activity.date.toDate() : new Date(activity.date);

        // Daily
        if (activityDate.toDateString() === yesterday.toDateString()) {
          acc.stats.daily += activity.co2e;
        }

        // This Week
        if (activityDate >= startOfThisWeek && activityDate <= endOfThisWeek) {
          acc.stats.weekly += activity.co2e;
          if (activity.category === 'travel') acc.chartData.thisWeek.transport += activity.co2e;
          if (activity.category === 'household') acc.chartData.thisWeek.energy += activity.co2e;
          if (activity.category === 'food') acc.chartData.thisWeek.food += activity.co2e;
        }

        // Last Week
        if (activityDate >= startOfLastWeek && activityDate <= endOfLastWeek) {
          acc.stats.last_weekly += activity.co2e;
          if (activity.category === 'travel') acc.chartData.lastWeek.transport += activity.co2e;
          if (activity.category === 'household') acc.chartData.lastWeek.energy += activity.co2e;
          if (activity.category === 'food') acc.chartData.lastWeek.food += activity.co2e;
        }

        return acc;
      },
      { stats: initialStats, chartData: initialChartData }
    );

    return {
      stats: calculatedStats.stats,
      chartData: [
        { name: 'Last Wk', ...calculatedStats.chartData.lastWeek },
        { name: 'This Wk', ...calculatedStats.chartData.thisWeek },
      ],
    };
  }, [activities]);

  const displayName = user?.displayName?.split(' ')[0] || 'User';

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          Welcome back, {displayName}!
        </h1>
      </div>
      <StatsCards stats={stats} weeklyGoal={activeGoal} isLoading={isLoadingActivities || isLoadingGoals} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <EmissionsChart data={chartData} />
        </div>
        <GamificationPanel />
      </div>
    </main>
  );
}
