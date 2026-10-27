import { IoniconName } from './icons';
import type { ChallengeCategory } from './ActivityModel';

export type ChallengeTab = 'Rules' | 'Details' | 'Rewards';

export interface InfoItem {
  icon: IoniconName;
  title: string;
  subtitle?: string;
}

export interface Challenge {
  category: ChallengeCategory;
  title: string;
  durationDays: number;
  level: string;
  participants: number;
  description: string;
  endsIn: { days: number; hours: number; minutes: number };
  elapsedDays: number;
  target: string;
  reward: string;
  rules: string[];
  details: InfoItem[];
  rewards: InfoItem[];
}
