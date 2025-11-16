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
  Flame,
  Fuel,
  Utensils
} from 'lucide-react';
import { useState } from 'react';
import type { Activity } from '@/lib/types';
import { doc } from 'firebase/firestore';

const formSchema = z.object({
  category: z.enum([
    'electricity',
    'travel',
    'food',
    'household',
    'waste',
  ]),
  // Travel fields
  travelFuelType: z.string().optional(),
  vehicleType: z.string().optional(),
  distance: z.coerce.number().positive().optional(),
  // Food fields
  mealType: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  foodFuelType: z.string().optional(),
  cookingDuration: z.coerce.number().positive().optional(),
  // Electricity / Household fields
  appliance: z.string().optional(),
  hoursUsed: z.coerce.number().positive().optional(),
  // Waste fields
  wasteGenerated: z.coerce.number().positive().optional(),
  wasteRecycled: z.coerce.number().nonnegative().optional(),
});

type ActivityFormValues = z.infer<typeof formSchema>;

// Emission factors (kg CO2e per unit)
const emissionFactors = {
  electricity: 0.82, // kg CO2e per kWh
  travel: {
    petrol: { car: 0.192, bike: 0.113 },
    diesel: { car: 0.171, bus: 0.027 },
    ev: { car: 0.05, bike: 0.01, bus: 0.015 },
    train: 0.041, // generic train
    flight: 0.255, // domestic flight
  },
  food: {
    'non-veg': 7.19, // kg CO2e per meal
    'dairy-heavy': 2.5,
    veg: 2.0,
    vegan: 1.5,
    processed: 4.0,
    cooking: {
      cng: 0.18, // per hour
      lpg: 0.22, // per hour
      electricity: 0.82 // per kWh, assuming 1 hour uses 1 kWh
    }
  },
  household: {
    ac: 1.5, // kg CO2e per hour
    'washing-machine': 0.6,
    cooler: 0.2,
    heater: 2.0,
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
      const meal = values.mealType as keyof typeof emissionFactors.food | undefined;
      const quantity = values.quantity || 0;
      const cookingFuel = values.foodFuelType as keyof typeof emissionFactors.food.cooking | undefined;
      const cookingHours = values.cookingDuration || 0;
      description = `${quantity} ${values.mealType} meal(s)`;

      if (meal && meal in emissionFactors.food) {
        co2e += quantity * (emissionFactors.food as any)[meal];
      }
      if (cookingFuel && cookingHours > 0) {
        description += ` cooked for ${cookingHours}h using ${cookingFuel}`;
        co2e += cookingHours * emissionFactors.food.cooking[cookingFuel];
      }
      break;
    }
    case 'electricity': {
      const usage = values.hoursUsed || 0;
      description = `Used electricity for ${usage} kWh`;
      co2e = usage * emissionFactors.electricity;
      break;
    }
    case 'household': {
      const appliance = values.appliance as keyof typeof emissionFactors.household | undefined;
      const hours = values.hoursUsed || 0;
      description = `Used ${values.appliance} for ${hours} hours`;
      if (appliance && appliance in emissionFactors.household) {
        co2e = hours * emissionFactors.household[appliance];
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


export function ActivityLogForm({ onActivityLog }: { onActivityLog: (activity: Omit<Activity, 'id' | 'date'>) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'travel',
      travelFuelType: '',
      vehicleType: '',
      distance: undefined,
      mealType: '',
      quantity: undefined,
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

  function onSubmit(values: ActivityFormValues) {
    const { description, co2e } = categoryToDescriptionAndCo2e(values);
    
    onActivityLog({
      category: values.category,
      description,
      co2e,
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
      case 'electricity':
        return (
          <>
            <FormField
              control={form.control}
              name="hoursUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Electricity Usage (kWh)</FormLabel>
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
                          <Utensils className="h-4 w-4" /> Vegetarian
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
                      <SelectItem value="cng">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4" /> CNG
                        </div>
                      </SelectItem>
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
