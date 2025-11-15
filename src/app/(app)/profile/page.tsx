'use client';

import { mockUserProfile, mockActivities } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Activity } from '@/lib/types';

export default function ProfilePage() {

  const handleExport = () => {
    const activitiesToExport = mockActivities;
    if (!activitiesToExport.length) {
      alert("No data to export.");
      return;
    }

    const headers = ['id', 'date', 'description', 'category', 'co2e'];
    const csvRows = [
      headers.join(','), 
      ...activitiesToExport.map((row: Activity) => {
        const values = [
          row.id,
          format(row.date, 'yyyy-MM-dd'),
          `"${row.description.replace(/"/g, '""')}"`, 
          row.category,
          row.co2e.toFixed(2),
        ];
        return values.join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ecotrack-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          Your Profile
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} />
                        <AvatarFallback>{mockUserProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{mockUserProfile.name}</h2>
                    <p className="text-sm text-muted-foreground">{mockUserProfile.email}</p>
                    <p className="text-xs text-muted-foreground mt-2">Joined on {format(mockUserProfile.joined, "MMMM d, yyyy")}</p>
                    <Button variant="outline" className="mt-4">Change Picture</Button>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={mockUserProfile.name} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={mockUserProfile.email} />
                        </div>
                        <Button>Save Changes</Button>
                    </form>
                    <Separator className="my-6" />
                     <div>
                        <h3 className="text-lg font-medium">Data Export</h3>
                        <p className="text-sm text-muted-foreground mb-4">Download a copy of your emissions data.</p>
                        <Button variant="secondary" onClick={handleExport}>Export My Data (CSV)</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
