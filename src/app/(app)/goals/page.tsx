
'use client';
import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { WeeklyGoal } from '@/lib/types';
import { Loader2, Target, History } from 'lucide-react';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const goalSchema = z.object({
  goal: z.coerce.number().positive('Goal must be a positive number.').min(1, 'Goal must be at least 1.'),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function GoalsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal: 15,
    },
  });

  const goalsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'weeklyGoals'), orderBy('startDate', 'desc'));
  }, [user, firestore]);

  const { data: goals, isLoading } = useCollection<WeeklyGoal>(goalsQuery);
  
  const activeGoal = goals?.find(g => g.status === 'active');
  const pastGoals = goals?.filter(g => g.status !== 'active');

  const onSubmit = async (values: GoalFormValues) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to set a goal.' });
      return;
    }
    setIsSubmitting(true);

    const now = new Date();
    const startDate = startOfWeek(now, { weekStartsOn: 1 });
    const endDate = endOfWeek(now, { weekStartsOn: 1 });

    const newGoal: Omit<WeeklyGoal, 'id'> = {
      userId: user.uid,
      goal: values.goal,
      startDate,
      endDate,
      status: 'active',
      createdAt: serverTimestamp(),
    };

    try {
        const batch = writeBatch(firestore);

        // Deactivate any existing active goals
        if (activeGoal) {
            const activeGoalRef = doc(firestore, 'users', user.uid, 'weeklyGoals', activeGoal.id);
            batch.update(activeGoalRef, { status: 'failed' });
        }
        
        // Add the new goal
        const goalsCol = collection(firestore, 'users', user.uid, 'weeklyGoals');
        addDocumentNonBlocking(goalsCol, newGoal)

        toast({
            title: 'Goal Set!',
            description: `Your new weekly goal is ${values.goal} kg CO₂e.`,
        });
        form.reset();
    } catch (error) {
        console.error('Error setting goal:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not set your new goal.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          Weekly Goals
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target />Set a New Weekly Goal</CardTitle>
            <CardDescription>
              Challenge yourself by setting a weekly CO₂e emission target.
              {activeGoal && ' Setting a new goal will replace your current one.'}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly CO₂e Target (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {activeGoal ? 'Set New Goal' : 'Set Goal'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {activeGoal && (
             <Card>
                <CardHeader>
                    <CardTitle>Current Active Goal</CardTitle>
                    <CardDescription>
                        For the week of {format(activeGoal.startDate.toDate(), 'MMM d')} to {format(activeGoal.endDate.toDate(), 'MMM d')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-baseline">
                        <p className="text-4xl font-bold">{activeGoal.goal.toFixed(1)}</p>
                        <p className="text-muted-foreground">kg CO₂e</p>
                    </div>
                </CardContent>
             </Card>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History />Goal History</CardTitle>
          <CardDescription>A record of your past weekly goals.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto my-4" />
                <p>Loading goal history...</p>
            </div>
          ) : pastGoals && pastGoals.length > 0 ? (
             <div className="space-y-4">
                {pastGoals.map(goal => {
                    const goalStartDate = goal.startDate.toDate ? goal.startDate.toDate() : new Date(goal.startDate);
                    const progress = goal.actualEmission && goal.goal ? (goal.actualEmission / goal.goal) * 100 : 0;
                    const succeeded = goal.actualEmission !== undefined && goal.actualEmission <= goal.goal;
                    
                    return (
                        <div key={goal.id} className="p-4 border rounded-lg">
                             <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">Week of {format(goalStartDate, 'MMMM d, yyyy')}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Goal: {goal.goal} kg | Actual: {goal.actualEmission?.toFixed(2) ?? 'N/A'} kg
                                    </p>
                                </div>
                                <div className={`text-sm font-bold ${succeeded ? 'text-green-600' : 'text-red-600'}`}>
                                    {goal.status === 'completed' ? 'Succeeded' : 'Failed'}
                                </div>
                             </div>
                             <Progress value={Math.min(progress, 100)} className="mt-2 h-2" />
                        </div>
                    )
                })}
             </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">You have no past goals.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
