
'use client';

import { useState } from 'react';
import { mockActivities } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Activity, UserProfile } from '@/lib/types';
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialProfileState: UserProfile = {
  name: '',
  email: '',
  joined: new Date(),
  avatarUrl: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  country: '',
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfileState);
  const { toast } = useToast();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, you'd send this to a backend.
    // For now, we just exit edit mode.
    setIsEditing(false);
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
    });
  };

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
                        <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                        <AvatarFallback>{profile.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{profile.name || 'User'}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <p className="text-xs text-muted-foreground mt-2">Joined on {format(profile.joined, "MMMM d, yyyy")}</p>
                    <Button variant="outline" className="mt-4">Change Picture</Button>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            {isEditing ? "Update your personal details here." : "View your account details."}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Profile</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={profile.email} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" value={profile.phone} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address1">Address Line 1</Label>
                            <Input id="address1" value={profile.address1} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address2">Address Line 2</Label>
                            <Input id="address2" value={profile.address2} onChange={handleInputChange} disabled={!isEditing} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={profile.city} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" value={profile.country} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                        </div>
                        {isEditing && <Button onClick={handleSave}>Save Changes</Button>}
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
