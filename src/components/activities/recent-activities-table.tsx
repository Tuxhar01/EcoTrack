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
import { mockActivities } from '@/lib/data';
import { EmissionCategory } from '@/lib/types';
import { Car, Zap, Leaf, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

const categoryMap: { [key in EmissionCategory]: { icon: React.ElementType, label: string } } = {
  transport: { icon: Car, label: 'Transport' },
  energy: { icon: Zap, label: 'Energy' },
  food: { icon: Leaf, label: 'Food' },
  shopping: { icon: ShoppingCart, label: 'Shopping' },
};

export function RecentActivitiesTable() {
  const sortedActivities = [...mockActivities].sort((a, b) => b.date.getTime() - a.date.getTime());

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
          const { icon: Icon, label } = categoryMap[activity.category];
          return (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{format(activity.date, 'MMM d, yyyy')}</TableCell>
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
