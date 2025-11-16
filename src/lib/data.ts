import type { UserProfile, Activity, EmissionDataPoint, Badge, Review } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Car, Zap, Flame, Award, Utensils, Trophy } from 'lucide-react';

const userAvatar = PlaceHolderImages.find(image => image.id === 'user-avatar-1');

export const mockUserProfile: UserProfile = {
  name: 'Piyush',
  email: 'piyush@gmail.com',
  joined: new Date('2023-10-01'),
  avatarUrl: 'https://picsum.photos/seed/103/100/100',
  phone: '+916203816318',
  address1: '123 Sustainability Lane',
  address2: 'Apt 4B',
  city: 'Greenville',
  country: 'USA',
};

export const mockActivities: Activity[] = [
  { id: '1', date: new Date('2024-07-20'), description: 'Morning commute', category: 'travel', co2e: 2.5 },
  { id: '2', date: new Date('2024-07-20'), description: 'Lunch (Chicken Salad)', category: 'food', co2e: 1.2 },
  { id: '3', date: new Date('2024-07-20'), description: 'Home electricity', category: 'electricity', co2e: 3.1 },
  { id: '4', date: new Date('2024-07-19'), description: 'Bus to city center', category: 'travel', co2e: 0.8 },
  { id: '6', date: new Date('2024-07-18'), description: 'Bike to work', category: 'travel', co2e: 0 },
];

export const mockEmissionStats = {
  daily: mockActivities
    .filter(a => a.date.getDate() === new Date().getDate() - 1) // yesterday
    .reduce((sum, a) => sum + a.co2e, 6.8),
  weekly: mockActivities.reduce((sum, a) => sum + a.co2e, 8.1),
};

export const mockChartData: EmissionDataPoint[] = [
  { name: 'Last Wk', transport: 7.2, energy: 5.1, food: 3.9 },
  { name: 'This Wk', transport: 3.3, energy: 3.1, food: 1.7 },
];

export const mockBadges: Badge[] = [
  { id: '1', name: 'Eco Starter', description: 'Logged your first activity.', icon: Utensils, unlocked: true },
  { id: '2', name: 'Green Commuter', description: 'Used a green transport option 5 times.', icon: Car, unlocked: true },
  { id: '3', name: 'Energy Saver', description: 'Kept energy usage below 5kg CO2e for a week.', icon: Zap, unlocked: true },
  { id: '4', name: 'Activity Streak', description: 'Logged an activity for 7 days in a row.', icon: Flame, unlocked: false },
  { id: '5', name: 'Low Carbon Diet', description: 'Ate low-carbon meals for 3 consecutive days.', icon: Award, unlocked: false },
  { id: '6', name: 'Footprint Hero', description: 'Reduced your weekly footprint by 20%.', icon: Trophy, unlocked: false },
];

export const mockGamification = {
  streak: 5,
  badges: mockBadges,
};

export const faqs = [
  "How is my carbon footprint calculated?",
  "What are emission factors?",
  "How can I reduce my transport emissions?",
  "What's the most impactful change I can make?",
  "How does my diet affect my carbon footprint?",
  "Is this app free to use?",
  "How much CO2 is emitted if I drive a petrol car for 20 km?",
  "What is the carbon footprint of eating non-veg food twice a day for a week?"
];

export const mockReviews: Review[] = [
    {
        id: '1',
        name: 'Dr. Prashant Bhardwaj',
        avatarUrl: 'https://picsum.photos/seed/rev1/100/100',
        rating: 5,
        comment: 'EcoTrack has completely changed the way I think about my daily impact. It\'s easy to use and incredibly insightful. Highly recommend!'
    },
    {
        id: '2',
        name: 'Dr. Paramvir Singh',
        avatarUrl: 'https://picsum.photos/seed/rev2/100/100',
        rating: 4,
        comment: 'A great app for anyone looking to be more environmentally conscious. The AI coach gives practical tips that are easy to follow.'
    },
    {
        id: '3',
        name: 'Abhishek Sakhare',
        avatarUrl: 'https://picsum.photos/seed/Abhishek/100/100',
        rating: 5,
        comment: 'Finally, an app that makes carbon tracking simple and not a chore. The gamification features keep me motivated.'
    }
];
