import type { ImageSourcePropType } from 'react-native';

import {
  mockCommunityUsers,
  mockCurrentUser,
  type MockUser,
} from './MockData';

export { thirtyDayChallengeId } from './MockData';

export type RankingPeriod = 'Weekly' | 'Monthly' | 'All Time';

export type LeaderboardFilter =
  | 'Everyone'
  | 'Friends'
  | '30-Day Challenge';

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  initials: string;
  avatarColor: string;
  avatar?: ImageSourcePropType;
  totalPoints: number;
  pointsByPeriod: Record<RankingPeriod, number>;
  activeChallengeIds: string[];
  streak: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardEntry extends LeaderboardUser {
  points: number;
  rank: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
}

export interface LevelTier {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
}

export const rankingPeriods: RankingPeriod[] = [
  'Weekly',
  'Monthly',
  'All Time',
];

export const leaderboardFilters: LeaderboardFilter[] = [
  'Everyone',
  'Friends',
  '30-Day Challenge',
];

export const levelTiers: LevelTier[] = [
  { level: 1, title: 'Rookie', minPoints: 0, maxPoints: 500 },
  { level: 2, title: 'Starter', minPoints: 500, maxPoints: 1000 },
  { level: 3, title: 'Mover', minPoints: 1000, maxPoints: 1500 },
  { level: 4, title: 'Challenger', minPoints: 1500, maxPoints: 2500 },
  { level: 5, title: 'Elite', minPoints: 2500, maxPoints: 4000 },
  { level: 6, title: 'Legend', minPoints: 4000, maxPoints: 6000 },
];

function toPointsByPeriod(
  points: MockUser['points'],
): Record<RankingPeriod, number> {
  return {
    Weekly: points.weekly,
    Monthly: points.monthly,
    'All Time': points.allTime,
  };
}

function toLeaderboardUser(
  user: MockUser,
  isCurrentUser = false,
): LeaderboardUser {
  return {
    id: user.id,
    name: user.displayName,
    username: user.username,
    initials: user.initials,
    avatarColor: user.avatarColor,
    avatar: user.avatar,
    totalPoints: user.points.allTime,
    pointsByPeriod: toPointsByPeriod(user.points),
    activeChallengeIds: [...user.activeChallengeIds],
    streak: user.streak,
    ...(isCurrentUser && { isCurrentUser: true }),
  };
}

export const leaderboardUsers: LeaderboardUser[] = [
  toLeaderboardUser(mockCurrentUser, true),
  ...mockCommunityUsers.map((user) => toLeaderboardUser(user)),
];

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Workout',
    description: 'Complete your first workout',
    icon: '🏅',
    unlocked: true,
    progress: 100,
  },
  {
    id: '2',
    title: 'Consistency Star',
    description: 'Work out 7 days in a row',
    icon: '⭐',
    unlocked: true,
    progress: 100,
  },
  {
    id: '3',
    title: 'Challenge Champion',
    description: 'Complete 5 fitness challenges',
    icon: '🏆',
    unlocked: false,
    progress: 60,
  },
  {
    id: '4',
    title: 'Step Master',
    description: 'Reach your step goal 10 times',
    icon: '👟',
    unlocked: false,
    progress: 30,
  },
  {
    id: '5',
    title: 'Early Bird',
    description: 'Finish 5 morning workouts',
    icon: '🌅',
    unlocked: false,
    progress: 80,
  },
  {
    id: '6',
    title: 'Hydration Hero',
    description: 'Log 8 glasses of water for 7 days',
    icon: '💧',
    unlocked: false,
    progress: 45,
  },
];

export const rewards: Reward[] = [
  {
    id: 'avatar-frame',
    title: 'Custom Avatar Frame',
    description: 'Stand out from the crowd',
    cost: 1500,
    icon: '🎁',
  },
  {
    id: 'premium-week',
    title: 'Free Premium Week',
    description: 'Enjoy premium features',
    cost: 2000,
    icon: '🎀',
  },
  {
    id: 'coach-pack',
    title: 'Coach Video Pack',
    description: 'Learn from a fitness coach',
    cost: 3500,
    icon: '🏆',
  },
];
