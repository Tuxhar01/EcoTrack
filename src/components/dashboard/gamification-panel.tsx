import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { mockGamification } from '@/lib/data';
import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GamificationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Your Progress
        </CardTitle>
        <CardDescription>Stay consistent to unlock new badges!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg bg-muted p-4">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="font-semibold">Activity Streak</span>
          </div>
          <div className="text-2xl font-bold">{mockGamification.streak} days</div>
        </div>
        <div className="mt-4">
          <h4 className="mb-2 font-medium">Badges</h4>
          <TooltipProvider>
            <div className="flex flex-wrap gap-4">
              {mockGamification.badges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full border-2 bg-secondary transition-opacity',
                        badge.unlocked ? 'opacity-100 border-primary' : 'opacity-40'
                      )}
                    >
                      <badge.icon
                        className={cn(
                          'h-6 w-6',
                          badge.unlocked ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{badge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                    {!badge.unlocked && <p className="text-xs italic">(Locked)</p>}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
