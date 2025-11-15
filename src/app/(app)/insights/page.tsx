'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAiSuggestions } from '@/lib/actions';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockChartData, mockActivities } from '@/lib/data';

export default function InsightsPage() {
  const [suggestions, setSuggestions] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetSuggestions = () => {
    startTransition(async () => {
      const thisWeekData = mockChartData.find(d => d.name === 'This Wk');
      if (!thisWeekData) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not find data for this week.',
        });
        return;
      }

      const recentActivitiesSummary = mockActivities.slice(0, 5).map(a => a.description).join(', ');

      const input = {
        transportEmissions: thisWeekData.transport,
        energyEmissions: thisWeekData.energy,
        foodEmissions: thisWeekData.food,
        recentActivities: recentActivitiesSummary,
      };

      const result = await getAiSuggestions(input);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else if (result.suggestions) {
        setSuggestions(result.suggestions);
      }
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          AI-Powered Insights
        </h1>
      </div>
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Personalized Suggestions
          </CardTitle>
          <CardDescription>
            Click the button below to get personalized tips for reducing your carbon footprint based on your recent activities.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[120px]">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : suggestions ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestions}</p>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-sm text-center text-muted-foreground/80 italic">Your personalized suggestions will appear here.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGetSuggestions} disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate New Suggestions'
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
