'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Zap,
  Car,
  Leaf,
  Home,
  Trash2,
  Bus,
  Train,
  Bike,
  Plane,
  Beef,
  Vegan,
  GlassWater,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { Activity } from '@/lib/types';

const formSchema = z.object({
  category: z.enum([
    'electricity',
    'travel',
    'food',
    'household',
    'waste',
    'shopping'
  ]),
  // Travel fields
  vehicleType: z.string().optional(),
  distance: z.coerce.number().positive().optional(),
  // Food fields
  mealType: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  // Electricity / Household fields
  appliance: z.string().optional(),
  hoursUsed: z.coerce.number().positive().optional(),
  // Waste fields
  wasteGenerated: z.coerce.number().positive().optional(),
  wasteRecycled: z.coerce.number().nonnegative().optional(),
  // Shopping
  shoppingDescription: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof formSchema>;

const categoryToDescription = (values: ActivityFormValues): string => {
  switch (values.category) {
    case 'travel':
      return `Travel by ${values.vehicleType} for ${values.distance} km`;
    case 'food':
      return `${values.quantity} ${values.mealType} meal(s)`;
    case 'electricity':
      return `Used electricity for ${values.hoursUsed} kWh`;
    case 'household':
        return `Used ${values.appliance} for ${values.hoursUsed} hours`;
    case 'waste':
        return `Generated ${values.wasteGenerated}kg of waste, recycled ${values.wasteRecycled}kg`;
    case 'shopping':
        return values.shoppingDescription || 'Shopping';
    default:
      return 'Logged an activity';
  }
}


export function ActivityLogForm({ onActivityLog }: { onActivityLog: (activity: Omit<Activity, 'id' | 'date' | 'co2e'>) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'travel',
      vehicleType: '',
      distance: undefined,
      mealType: '',
      quantity: undefined,
      appliance: '',
      hoursUsed: undefined,
      wasteGenerated: undefined,
      wasteRecycled: 0,
      shoppingDescription: '',
    },
  });

  const selectedCategory = useWatch({
    control: form.control,
    name: 'category',
  });

  function onSubmit(values: ActivityFormValues) {
    const description = categoryToDescription(values);
    const carbonValue = Math.random() * 5; // Placeholder
    
    onActivityLog({
      category: values.category,
      description,
    });

    toast({
      title: 'Activity Logged!',
      description: `Your activity has been recorded with a footprint of ${carbonValue.toFixed(2)} kg CO₂e.`,
    });
    setOpen(false);
    form.reset();
  }

  const renderCategoryFields = () => {
    switch (selectedCategory) {
      case 'electricity':
        return (
          <>
            <FormField
              control={form.control}
              name="hoursUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Usage (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2.5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'travel':
        return (
          <>
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="car">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" /> Car
                        </div>
                      </SelectItem>
                      <SelectItem value="bike">
                        <div className="flex items-center gap-2">
                          <Bike className="h-4 w-4" /> Bike
                        </div>
                      </SelectItem>
                      <SelectItem value="bus">
                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4" /> Bus
                        </div>
                      </SelectItem>
                      <SelectItem value="train">
                        <div className="flex items-center gap-2">
                          <Train className="h-4 w-4" /> Train
                        </div>
                      </SelectItem>
                      <SelectItem value="flight">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4" /> Flight
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'food':
        return (
          <>
            <FormField
              control={form.control}
              name="mealType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a meal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="veg">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4" /> Vegetarian
                        </div>
                      </SelectItem>
                      <SelectItem value="non-veg">
                        <div className="flex items-center gap-2">
                          <Beef className="h-4 w-4" /> Non-Vegetarian
                        </div>
                      </SelectItem>
                      <SelectItem value="vegan">
                        <div className="flex items-center gap-2">
                          <Vegan className="h-4 w-4" /> Vegan
                        </div>
                      </SelectItem>
                      <SelectItem value="dairy-heavy">
                        <div className="flex items-center gap-2">
                          <GlassWater className="h-4 w-4" /> Dairy-heavy
                        </div>
                      </SelectItem>
                       <SelectItem value="processed">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" /> Processed Food
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (meals)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'household':
        return (
          <>
            <FormField
              control={form.control}
              name="appliance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appliance</FormLabel>
                   <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an appliance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ac">AC</SelectItem>
                      <SelectItem value="washing-machine">Washing Machine</SelectItem>
                      <SelectItem value="cooler">Cooler</SelectItem>
                      <SelectItem value="heater">Heater</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hoursUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours of Usage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'waste':
        return (
          <>
            <FormField
              control={form.control}
              name="wasteGenerated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waste Generated (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1.5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wasteRecycled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waste Recycled (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 0.5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
        case 'shopping':
        return (
          <>
            <FormField
              control={form.control}
              name="shoppingDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New clothes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Log New Activity</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Log a New Activity</SheetTitle>
          <SheetDescription>
            Add a new activity to calculate its carbon footprint.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electricity">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" /> Electricity
                        </div>
                      </SelectItem>
                      <SelectItem value="travel">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" /> Travel
                        </div>
                      </SelectItem>
                      <SelectItem value="food">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4" /> Food
                        </div>
                      </SelectItem>
                      <SelectItem value="household">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" /> Household
                        </div>
                      </SelectItem>
                      <SelectItem value="waste">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" /> Waste & Recycling
                        </div>
                      </SelectItem>
                       <SelectItem value="shopping">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" /> Shopping
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderCategoryFields()}

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit">Save Activity</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
