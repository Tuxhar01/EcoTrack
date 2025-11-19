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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Zap,
  Car,
  Home,
  Trash2,
  Bus,
  Train,
  Bike,
  Plane,
  Flame,
  Fuel,
  Utensils,
  CalendarIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { Activity } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  category: z.enum([
    'travel',
    'food',
    'household',
    'waste',
  ]),
  date: z.date().optional(),
  // Travel fields
  travelFuelType: z.string().optional(),
  vehicleType: z.string().optional(),
  distance: z.coerce.number().positive().optional(),
  // Food fields
  foodFuelType: z.string().optional(),
  cookingDuration: z.coerce.number().positive().optional(),
  // Household fields
  appliance: z.string().optional(),
  hoursUsed: z.coerce.number().positive().optional(),
  // Waste fields
  wasteGenerated: z.coerce.number().positive().optional(),
  wasteRecycled: z.coerce.number().nonnegative().optional(),
});

type ActivityFormValues = z.infer<typeof formSchema>;

// Emission factors (kg CO2e per unit)
const emissionFactors = {
  travel: {
    petrol: { car: 0.192, bike: 0.113, scooter: 0.08, auto: 0.1, truck: 0.3 },
    diesel: { car: 0.171, bus: 0.027, truck: 0.25 },
    ev: { car: 0.05, bike: 0.01, bus: 0.015, scooter: 0.008, auto: 0.012, truck: 0.08 },
    train: 0.041, // generic train
    flight: 0.255, // domestic flight
  },
  food: {
    cooking: {
      lpg: 0.22, // per hour
      electricity: 0.82 // per kWh, assuming 1 hour uses 1 kWh
    }
  },
  household: {
    ac: 1.5, // kg CO2e per hour
    'washing-machine': 0.6,
    cooler: 0.2,
    heater: 2.0,
    electricity: 0.82, // kg CO2e per kWh for general usage
  },
  waste: {
    generated: 0.5, // kg CO2e per kg
    recycled: -0.3, // negative emission for recycling
  },
};


const categoryToDescriptionAndCo2e = (values: ActivityFormValues): { description: string; co2e: number } => {
  let description = '';
  let co2e = 0;

  switch (values.category) {
    case 'travel': {
      const distance = values.distance || 0;
      const fuel = values.travelFuelType as keyof typeof emissionFactors.travel | undefined;
      const vehicle = values.vehicleType as keyof typeof emissionFactors.travel.petrol | undefined;
      description = `Travel by ${values.vehicleType} for ${distance} km`;

      if (fuel && vehicle) {
         if (fuel === 'train' || fuel === 'flight') {
           co2e = distance * emissionFactors.travel[fuel];
         } else if (fuel === 'petrol' || fuel === 'diesel' || fuel === 'ev') {
            const vehicleFactors = emissionFactors.travel[fuel];
            if (vehicle in vehicleFactors) {
                co2e = distance * (vehicleFactors as any)[vehicle];
            }
         }
      }
      break;
    }
    case 'food': {
      const cookingFuel = values.foodFuelType as keyof typeof emissionFactors.food.cooking | undefined;
      const cookingHours = values.cookingDuration || 0;
      description = `Logged a food activity`;
      
      const averageMealEmission = 2.5; // Average kg CO2e per meal
      co2e += averageMealEmission; 

      if (cookingFuel && cookingHours > 0) {
        description = `Cooked for ${cookingHours}h using ${cookingFuel}`;
        co2e += cookingHours * emissionFactors.food.cooking[cookingFuel];
      }
      break;
    }
    case 'household': {
      const appliance = values.appliance as keyof typeof emissionFactors.household | undefined;
      const hours = values.hoursUsed || 0;
      if (appliance === 'electricity') {
        description = `Used electricity for ${hours} kWh`;
        co2e = hours * emissionFactors.household.electricity;
      } else {
        description = `Used ${values.appliance} for ${hours} hours`;
        if (appliance && appliance in emissionFactors.household) {
          co2e = hours * emissionFactors.household[appliance];
        }
      }
      break;
    }
    case 'waste': {
      const generated = values.wasteGenerated || 0;
      const recycled = values.wasteRecycled || 0;
      description = `Generated ${generated}kg of waste, recycled ${recycled}kg`;
      co2e = (generated * emissionFactors.waste.generated) + (recycled * emissionFactors.waste.recycled);
      break;
    }
    default:
      description = 'Logged an activity';
      co2e = 0;
  }

  return { description, co2e };
};


export function ActivityLogForm({ onActivityLog }: { onActivityLog: (activity: Omit<Activity, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'travel',
      date: new Date(),
      travelFuelType: '',
      vehicleType: '',
      distance: undefined,
      foodFuelType: '',
      cookingDuration: undefined,
      appliance: '',
      hoursUsed: undefined,
      wasteGenerated: undefined,
      wasteRecycled: 0,
    },
  });

  const selectedCategory = useWatch({
    control: form.control,
    name: 'category',
  });

  const selectedTravelFuelType = useWatch({
    control: form.control,
    name: 'travelFuelType',
  });

  const selectedAppliance = useWatch({
    control: form.control,
    name: 'appliance',
  });

  function onSubmit(values: ActivityFormValues) {
    const { description, co2e } = categoryToDescriptionAndCo2e(values);
    
    onActivityLog({
      category: values.category,
      description,
      co2e,
      date: values.date || new Date(),
    });

    toast({
      title: 'Activity Logged!',
      description: `Your activity has been recorded. CO₂e: ${co2e.toFixed(2)} kg`,
    });
    setOpen(false);
    form.reset();
  }

  const renderCategoryFields = () => {
    switch (selectedCategory) {
      case 'travel':
        return (
          <>
            <FormField
              control={form.control}
              name="travelFuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="petrol">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4" /> Petrol
                        </div>
                      </SelectItem>
                      <SelectItem value="diesel">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4" /> Diesel
                        </div>
                      </SelectItem>
                      <SelectItem value="ev">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" /> EV
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
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={selectedTravelFuelType === 'train' || selectedTravelFuelType === 'flight'}
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
                       <SelectItem value="scooter">
                        <div className="flex items-center gap-2">
                          <Bike className="h-4 w-4" /> Scooter
                        </div>
                      </SelectItem>
                       <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" /> Auto
                        </div>
                      </SelectItem>
                       <SelectItem value="truck">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" /> Truck
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
            <p className="text-xs text-muted-foreground">More vehicle categories & engine sizes coming in the next update.</p>
          </>
        );
      case 'food':
        return (
          <>
             <FormField
              control={form.control}
              name="foodFuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooking Fuel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lpg">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4" /> LPG
                        </div>
                      </SelectItem>
                      <SelectItem value="electricity">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" /> Electricity
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
              name="cookingDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooking Duration (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1.5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
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
                  <FormLabel>Type</FormLabel>
                   <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a household item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electricity">General Electricity</SelectItem>
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
                  <FormLabel>{selectedAppliance === 'electricity' ? 'Usage (kWh)' : 'Hours of Usage'}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={selectedAppliance === 'electricity' ? "e.g., 10" : "e.g., 3"} {...field} onChange={e => field.onChange(e.target.value === '' ? '' : +e.target.value)} value={field.value ?? ''}/>
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
                      <SelectItem value="travel">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" /> Travel
                        </div>
                      </SelectItem>
                      <SelectItem value="food">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4" /> Food
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderCategoryFields()}

            <SheetFooter className="pt-4 flex-row justify-end space-x-2">
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-[160px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
