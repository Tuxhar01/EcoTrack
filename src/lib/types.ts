export type EmissionCategory =
  | 'electricity'
  | 'travel'
  | 'food'
  | 'household'
  | 'waste';

export interface Activity {
  id: string;
  date: Date;
  description: string;
  category: EmissionCategory;
  co2e: number; // in kg
}

export interface EmissionDataPoint {
  name: string;
  transport: number;
  energy: number;
  food: number;
}

export interface Badge {
  id: string;
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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
