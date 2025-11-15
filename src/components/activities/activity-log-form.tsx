'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Car, Zap, Leaf, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function ActivityLogForm() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { toast } = useToast();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Here you would typically handle form submission, e.g., send to a server.
        // For this prototype, we'll just show a success message.
        toast({
            title: "Activity Logged!",
            description: "Your activity has been successfully recorded.",
        });
    }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Log New Activity</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Log a New Activity</SheetTitle>
          <SheetDescription>
            Add a new activity to calculate its carbon footprint.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="transport"><div className="flex items-center gap-2"><Car className="h-4 w-4" /> Transport</div></SelectItem>
                            <SelectItem value="energy"><div className="flex items-center gap-2"><Zap className="h-4 w-4" /> Energy</div></SelectItem>
                            <SelectItem value="food"><div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Food</div></SelectItem>
                            <SelectItem value="shopping"><div className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Shopping</div></SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="e.g., Morning commute by car" required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="value">Value (e.g., km, kWh)</Label>
                    <Input id="value" type="number" placeholder="15" required />
                </div>
                <div className="grid gap-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <SheetFooter>
            <SheetClose asChild>
                <Button type="submit">Save Activity</Button>
            </SheetClose>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
