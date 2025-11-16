'use client';

import { useEffect, useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { ActivityLogForm } from '@/components/activities/activity-log-form';
import { RecentActivitiesTable } from '@/components/activities/recent-activities-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockActivities } from '@/lib/data';
import type { Activity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { UpgradeAccountDialog } from '@/components/auth/upgrade-account-dialog';


export default function ActivitiesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);


  const activitiesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'activities');
  }, [user, firestore]);

  const { data: activities, isLoading } = useCollection<Activity>(activitiesQuery);

  // Seed mock data if the collection is empty
  useEffect(() => {
    if (user && firestore && !isLoading && activities && activities.length === 0 && !isSeeding) {
      const seedData = async () => {
        setIsSeeding(true);
        try {
          const batch = writeBatch(firestore);
          const activitiesCol = collection(firestore, 'users', user.uid, 'activities');
          
          mockActivities.forEach(activity => {
            const docRef = doc(activitiesCol); // Create a new doc with a generated ID
            // Make sure date is a JS Date object before converting
            const activityDate = activity.date instanceof Date ? activity.date : new Date(activity.date);
            batch.set(docRef, { ...activity, userId: user.uid, id: docRef.id, date: activityDate });
          });

          await batch.commit();
          toast({
            title: "Welcome!",
            description: "We've added some sample activities to get you started.",
          });
        } catch (error) {
          console.error("Error seeding data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add sample activities.",
          });
        } finally {
          setIsSeeding(false);
        }
      };
      // Timeout to prevent race condition on first load
      setTimeout(seedData, 1000);
    }
  }, [user, firestore, isLoading, activities, isSeeding, toast]);

  const handleAddActivity = (newActivity: Omit<Activity, 'id' | 'date'>) => {
    if (!user || !firestore) return;

    if (user.isAnonymous && activities && activities.length >= 10) {
      setShowUpgradeDialog(true);
      return;
    }

    const activitiesCol = collection(firestore, 'users', user.uid, 'activities');
    addDocumentNonBlocking(activitiesCol, {
      ...newActivity,
      userId: user.uid,
      date: new Date(),
    });
  };

  return (
    <>
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
              {user?.isAnonymous && ` (${(activities || []).length} / 10 entries used as Guest)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || isSeeding ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <RecentActivitiesTable activities={activities || []} />
            )}
          </CardContent>
        </Card>
      </main>
      <UpgradeAccountDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog} />
    </>
  );
}
