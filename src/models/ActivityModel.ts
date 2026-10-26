
export interface ActivityData {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  workoutMinutes: number;
  workoutGoal: number;
  streak: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  duration: number;
  day: number;
  totalDays: number;
  progress: number;
  reward: number;
  participants: string;
  icon: string;
  popular: boolean;
}

export type ChallengeCategory =
  | 'Steps'
  | 'Cardio'
  | 'Strength'
  | 'Flexibility';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
}

export const getActivityData = (): ActivityData => ({
  steps: 7542,
  stepsGoal: 10000,
  calories: 320,
  caloriesGoal: 500,
  workoutMinutes: 45,
  workoutGoal: 60,
  streak: 5,
});

export const getChallenges = (): Challenge[] => [
  {
    id: 'steps-7',
    title: '7-Day Step Challenge',
    description:
      'Take 10,000 steps daily for 7 days and build a healthy habit!',
    category: 'Steps',
    duration: 7,
    day: 4,
    totalDays: 7,
    progress: 57,
    reward: 100,
    participants: '12.5K',
    icon: '👟',
    popular: true,
  },
  {
    id: 'strength-30',
    title: '30-Day Strength Challenge',
    description: 'Build a stronger you with simple daily workouts.',
    category: 'Strength',
    duration: 30,
    day: 15,
    totalDays: 30,
    progress: 50,
    reward: 200,
    participants: '8.2K',
    icon: '🏋️',
    popular: false,
  },
  {
    id: 'mind-body-21',
    title: '21-Day Mind & Body',
    description: 'Combine movement, mindfulness and better habits.',
    category: 'Flexibility',
    duration: 21,
    day: 11,
    totalDays: 21,
    progress: 52,
    reward: 150,
    participants: '6.1K',
    icon: '🧘',
    popular: false,
  },
  {
    id: 'cardio-14',
    title: '14-Day Cardio Boost',
    description: 'Improve your stamina with fun daily cardio sessions.',
    category: 'Cardio',
    duration: 14,
    day: 6,
    totalDays: 14,
    progress: 43,
    reward: 120,
    participants: '5.4K',
    icon: '❤️',
    popular: true,
  },
];

export const getAchievements = (): Achievement[] => [
  { id: 'steps', icon: '👟', title: 'Step Starter' },
  { id: 'calories', icon: '🔥', title: 'Calorie Burner' },
  { id: 'challenge', icon: '🏆', title: 'Challenge Pro' },
  { id: 'streak', icon: '⚡', title: '5 Day Streak' },
];
