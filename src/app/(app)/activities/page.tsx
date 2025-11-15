'use client';

import { useState } from 'react';
import { ActivityLogForm } from '@/components/activities/activity-log-form';
import { RecentActivitiesTable } from '@/components/activities/recent-activities-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockActivities } from '@/lib/data';
import type { Activity } from '@/lib/types';


export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const handleAddActivity = (newActivity: Omit<Activity, 'id' | 'date' | 'co2e'>) => {
    const activityWithMetadata: Activity = {
      ...newActivity,
      id: Date.now().toString(),
      date: new Date(),
      co2e: Math.random() * 5, // Placeholder for real calculation
    };
    setActivities(prevActivities => [activityWithMetadata, ...prevActivities]);
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          Your Activities
        </h1>
        <ActivityLogForm onActivityLog={handleAddActivity} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>
            A log of your recently tracked activities and their carbon footprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivitiesTable activities={activities} />
        </CardContent>
      </Card>
    </main>
  );
}
