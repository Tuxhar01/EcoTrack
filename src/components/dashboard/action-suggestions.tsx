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

export function ActionSuggestions() {
  const [suggestions, setSuggestions] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetSuggestions = () => {
    startTransition(async () => {
      const thisWeekData = mockChartData.find(d => d.name === 'This Wk');
      if (!thisWeekData) return;

      const recentActivitiesSummary = mockActivities.slice(0, 3).map(a => a.description).join(', ');

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          AI-Powered Suggestions
        </CardTitle>
        <CardDescription>
          Get personalized tips to reduce your carbon footprint based on your recent activities.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[80px]">
        {isPending ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : suggestions ? (
          <p className="text-sm text-muted-foreground">{suggestions}</p>
        ) : (
          <p className="text-sm text-center text-muted-foreground/80 italic">Click the button below to generate suggestions.</p>
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
            'Get Suggestions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
