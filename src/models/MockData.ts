import type { ImageSourcePropType } from 'react-native';

export const thirtyDayChallengeId = 'strength-30';

export type MockCommunityRelationship =
  | 'friend'
  | 'pending-request'
  | 'community';

export interface MockPoints {
  weekly: number;
  monthly: number;
  allTime: number;
}

export interface MockUser {
  id: string;
  name: string;
  displayName: string;
  username: string;
  initials: string;
  avatarColor: string;
  avatar?: ImageSourcePropType;
  points: MockPoints;
  workouts: number;
  streak: number;
  activity: string;
  activeChallengeIds: string[];
}

export interface MockCurrentUser extends MockUser {
  workoutMinutes: number;
  weeklyWorkoutGoal: number;
}

export interface MockCommunityUser extends MockUser {
  relationship: MockCommunityRelationship;
}

export const mockCurrentUser: MockCurrentUser = {
  id: '4',
  name: 'Rawan Ahmed',
  displayName: 'Rawan',
  username: 'rawan_fit',
  initials: 'RA',
  avatarColor: '#C5B7F9',
  avatar: require('../assets/avatars/rawan.jpg'),
  points: {
    weekly: 480,
    monthly: 980,
    allTime: 1720,
  },
  workouts: 6,
  streak: 5,
  workoutMinutes: 45,
  weeklyWorkoutGoal: 8,
  activity: 'Strength · 45 min today',
  activeChallengeIds: [thirtyDayChallengeId],
};

export const mockCommunityUsers: MockCommunityUser[] = [
  {
    id: '3',
    name: 'Lina Hassan',
    displayName: 'Lina',
    username: 'lina_runs',
    initials: 'LI',
    avatarColor: '#B9A6FF',
    avatar: require('../assets/avatars/lina.jpg'),
    points: {
      weekly: 455,
      monthly: 1050,
      allTime: 1950,
    },
    workouts: 5,
    streak: 12,
    activity: 'Ran 5 km · 2h ago',
    activeChallengeIds: [thirtyDayChallengeId],
    relationship: 'friend',
  },
  {
    id: '2',
    name: 'Omar Ali',
    displayName: 'Omar',
    username: 'omar_lifts',
    initials: 'OM',
    avatarColor: '#C9FF75',
    avatar: require('../assets/avatars/omar.jpg'),
    points: {
      weekly: 580,
      monthly: 1200,
      allTime: 2180,
    },
    workouts: 4,
    streak: 9,
    activity: 'Strength · 45 min ago',
    activeChallengeIds: [],
    relationship: 'friend',
  },
  {
    id: '9',
    name: 'Sara Ahmed',
    displayName: 'Sara',
    username: 'sara_moves',
    initials: 'SA',
    avatarColor: '#A58AF7',
    avatar: require('../assets/avatars/sara.jpg'),
    points: {
      weekly: 270,
      monthly: 540,
      allTime: 920,
    },
    workouts: 4,
    streak: 6,
    activity: 'Yoga flow · 30 min ago',
    activeChallengeIds: [],
    relationship: 'friend',
  },
  {
    id: '10',
    name: 'Youssef Ali',
    displayName: 'Youssef',
    username: 'youssef_a',
    initials: 'YA',
    avatarColor: '#C5B7F9',
    avatar: require('../assets/avatars/youssef.jpg'),
    points: {
      weekly: 405,
      monthly: 790,
      allTime: 1420,
    },
    workouts: 3,
    streak: 3,
    activity: 'Cycling · 12 km',
    activeChallengeIds: [],
    relationship: 'friend',
  },
  {
    id: '11',
    name: 'Mariam Tarek',
    displayName: 'Mariam',
    username: 'mariam_t',
    initials: 'MT',
    avatarColor: '#B9A6FF',
    avatar: require('../assets/avatars/mariam.jpg'),
    points: {
      weekly: 190,
      monthly: 430,
      allTime: 760,
    },
    workouts: 1,
    streak: 0,
    activity: 'Walk · 3 km · 4d ago',
    activeChallengeIds: [],
    relationship: 'friend',
  },
  {
    id: '6',
    name: 'Nour Ibrahim',
    displayName: 'Nour',
    username: 'nour_ibr',
    initials: 'NO',
    avatarColor: '#D4FF9F',
    avatar: require('../assets/avatars/nour.jpg'),
    points: {
      weekly: 350,
      monthly: 720,
      allTime: 1300,
    },
    workouts: 3,
    streak: 4,
    activity: 'Morning run · 1h ago',
    activeChallengeIds: [],
    relationship: 'pending-request',
  },
  {
    id: '12',
    name: 'Hady Mahmoud',
    displayName: 'Hady',
    username: 'hady_m',
    initials: 'HM',
    avatarColor: '#D4FF9F',
    avatar: require('../assets/avatars/hady.jpg'),
    points: {
      weekly: 240,
      monthly: 480,
      allTime: 840,
    },
    workouts: 2,
    streak: 2,
    activity: 'Swim · yesterday',
    activeChallengeIds: [],
    relationship: 'pending-request',
  },
  {
    id: '1',
    name: 'Maya Farouk',
    displayName: 'Maya',
    username: 'maya_fit',
    initials: 'MA',
    avatarColor: '#A58AF7',
    avatar: require('../assets/avatars/maya.jpg'),
    points: {
      weekly: 620,
      monthly: 1310,
      allTime: 2450,
    },
    workouts: 7,
    streak: 18,
    activity: 'HIIT · 40 min ago',
    activeChallengeIds: [thirtyDayChallengeId],
    relationship: 'community',
  },
  {
    id: '5',
    name: 'Adam Nabil',
    displayName: 'Adam',
    username: 'adam_moves',
    initials: 'AD',
    avatarColor: '#8B63F6',
    avatar: require('../assets/avatars/adam.jpg'),
    points: {
      weekly: 390,
      monthly: 860,
      allTime: 1540,
    },
    workouts: 3,
    streak: 2,
    activity: 'Football · yesterday',
    activeChallengeIds: [],
    relationship: 'community',
  },
  {
    id: '7',
    name: 'Zara Mostafa',
    displayName: 'Zara',
    username: 'zara_lifts',
    initials: 'ZA',
    avatarColor: '#E3D9FF',
    avatar: require('../assets/avatars/zara.jpg'),
    points: {
      weekly: 410,
      monthly: 690,
      allTime: 1180,
    },
    workouts: 4,
    streak: 5,
    activity: 'Upper body · 3h ago',
    activeChallengeIds: [thirtyDayChallengeId],
    relationship: 'community',
  },
  {
    id: '8',
    name: 'Khalid Samir',
    displayName: 'Khalid',
    username: 'khalid_run',
    initials: 'KH',
    avatarColor: '#C9FF75',
    avatar: require('../assets/avatars/khalid.jpg'),
    points: {
      weekly: 300,
      monthly: 610,
      allTime: 1030,
    },
    workouts: 2,
    streak: 1,
    activity: 'Evening run · 2d ago',
    activeChallengeIds: [thirtyDayChallengeId],
    relationship: 'community',
  },
];

export function findMockUserByUsername(
  username: string,
): MockCommunityUser | undefined {
  const normalizedUsername = username
    .trim()
    .replace(/^@/, '')
    .toLowerCase();

  return mockCommunityUsers.find(
    (user) => user.username.toLowerCase() === normalizedUsername,
  );
}
