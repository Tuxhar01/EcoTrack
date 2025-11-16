'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmissionCategory, Activity } from '@/lib/types';
import { Car, Zap, Utensils, Home, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const categoryMap: { [key in EmissionCategory]: { icon: React.ElementType, label: string } } = {
  travel: { icon: Car, label: 'Travel' },
  food: { icon: Utensils, label: 'Food' },
  household: { icon: Home, label: 'Household' },
  waste: { icon: Trash2, label: 'Waste' },
};

const toDate = (date: any): Date => {
    if (!date) return new Date();
    if (date.toDate) return date.toDate(); // Firestore Timestamp
    if (typeof date === 'string' || typeof date === 'number') return new Date(date);
    return date;
}

export function RecentActivitiesTable({ activities }: { activities: Activity[] }) {
  const sortedActivities = [...activities].sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">CO₂e (kg)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedActivities.map((activity) => {
          const categoryInfo = categoryMap[activity.category];
          if (!categoryInfo) return null;
          const { icon: Icon, label } = categoryInfo;
          return (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{format(toDate(activity.date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <Icon className="h-3 w-3" />
                    {label}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{activity.co2e.toFixed(2)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
