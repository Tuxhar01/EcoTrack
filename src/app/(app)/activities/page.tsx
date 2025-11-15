import { ActivityLogForm } from '@/components/activities/activity-log-form';
import { RecentActivitiesTable } from '@/components/activities/recent-activities-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivitiesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          Your Activities
        </h1>
        <ActivityLogForm />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>
            A log of your recently tracked activities and their carbon footprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivitiesTable />
        </CardContent>
      </Card>
    </main>
  );
}
