export type EmissionCategory =
  | 'travel'
  | 'food'
  | 'household'
  | 'waste';

export interface Activity {
  id: string;
  date: any; // Can be Date or Firestore Timestamp
  description: string;
  category: EmissionCategory;
  co2e: number; // in kg
}

export interface EmissionChartData {
  transport: number;
  energy: number;
  food: number;
}


export interface Badge {
  id:string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  joined: Date;
  avatarUrl: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Review {
    id: string;
    name: string;
    avatarUrl: string;
    rating: number;
    comment: string;
}

export interface WeeklyGoal {
  id: string;
  userId: string;
  goal: number;
  startDate: any;
  endDate: any;
  status: 'active' | 'completed' | 'failed';
  actualEmission?: number;
  createdAt: any;
}
