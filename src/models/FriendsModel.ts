import type { ImageSourcePropType } from 'react-native';

import {
  findMockUserByUsername,
  mockCommunityUsers,
  type MockCommunityUser,
} from './MockData';

export interface Friend {
  id: number;
  name: string;
  username: string;
  initials: string;
  avatar?: ImageSourcePropType;
  activity: string;
  workouts: number;
  streak: number;
  points: number;
  color: string;
}

export interface FriendRequest {
  id: number;
  name: string;
  username: string;
  initials: string;
  avatar?: ImageSourcePropType;
  activity: string;
  workouts: number;
  streak: number;
  points: number;
  color: string;
}

export type FriendFilter = 'All' | 'On streak' | 'No streak';

export const friendFilterOptions: FriendFilter[] = [
  'All',
  'On streak',
  'No streak',
];

export type PrivateChallengeType =
  | 'Steps'
  | 'Streak'
  | 'Distance'
  | 'Duration';

export const privateChallengeTypes: PrivateChallengeType[] = [
  'Steps',
  'Streak',
  'Distance',
  'Duration',
];

export const challengeDurationOptions = [7, 14, 30] as const;

export interface PrivateChallenge {
  id: number;
  name: string;
  type: PrivateChallengeType;
  day: number;
  total: number;
  members: number;
  memberIds: number[];
}

function toFriend(user: MockCommunityUser): Friend {
  return {
    id: Number(user.id),
    name: user.name,
    username: user.username,
    initials: user.initials,
    avatar: user.avatar,
    activity: user.activity,
    workouts: user.workouts,
    streak: user.streak,
    points: user.points.allTime,
    color: user.avatarColor,
  };
}

function toFriendRequest(user: MockCommunityUser): FriendRequest {
  return {
    id: Number(user.id),
    name: user.name,
    username: `@${user.username}`,
    initials: user.initials,
    avatar: user.avatar,
    activity: user.activity,
    workouts: user.workouts,
    streak: user.streak,
    points: user.points.allTime,
    color: user.avatarColor,
  };
}

export const initialFriends: Friend[] = mockCommunityUsers
  .filter((user) => user.relationship === 'friend')
  .map(toFriend);

export const initialFriendRequests: FriendRequest[] = mockCommunityUsers
  .filter((user) => user.relationship === 'pending-request')
  .map(toFriendRequest);

export function findMockFriendByUsername(
  username: string,
): Friend | undefined {
  const user = findMockUserByUsername(username);

  return user ? toFriend(user) : undefined;
}

export const initialPrivateChallenges: PrivateChallenge[] = [
  {
    id: 1,
    name: 'Weekend Steps Crew',
    type: 'Steps',
    day: 4,
    total: 7,
    members: 4,
    memberIds: [3, 2, 9],
  },
  {
    id: 2,
    name: '30-Day Plank Battle',
    type: 'Duration',
    day: 12,
    total: 30,
    members: 3,
    memberIds: [3, 2],
  },
];
