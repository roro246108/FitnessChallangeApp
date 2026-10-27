import type { ActivityData } from './ActivityModel';
import { mockCurrentUser } from './MockData';

export const genderOptions = [
  'Female',
  'Male',
  'Prefer not to say',
] as const;

export type Gender = (typeof genderOptions)[number];

export interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  age: string;
  gender: Gender | '';
}

export type ProfileTextField =
  | 'fullName'
  | 'username'
  | 'email'
  | 'age';

export const fitnessActivities = [
  'Walking',
  'Running',
  'Cycling',
  'Strength Training',
  'Cardio',
  'Yoga',
  'Swimming',
] as const;

export type FitnessActivity = (typeof fitnessActivities)[number];

export const challengeTypes = [
  'Daily Challenges',
  'Weekly Challenges',
  '30-Day Challenges',
  'Steps Challenges',
  'Workout Challenges',
] as const;

export type ChallengeType = (typeof challengeTypes)[number];

export interface FitnessPreferences {
  activities: FitnessActivity[];
  challengeTypes: ChallengeType[];
}

export interface FitnessGoal {
  id: 'steps' | 'workout-minutes' | 'weekly-workouts';
  icon: string;
  label: string;
  currentLabel: string;
  targetLabel: string;
  progress: number;
}

function getGoalProgress(current: number, target: number): number {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((current / target) * 100));
}

export function getFitnessGoals(activity: ActivityData): FitnessGoal[] {
  return [
    {
      id: 'steps',
      icon: '👟',
      label: 'Daily steps',
      currentLabel: activity.steps.toLocaleString(),
      targetLabel: `${activity.stepsGoal.toLocaleString()} steps`,
      progress: getGoalProgress(activity.steps, activity.stepsGoal),
    },
    {
      id: 'workout-minutes',
      icon: '◷',
      label: 'Active minutes today',
      currentLabel: `${activity.workoutMinutes} min`,
      targetLabel: `${activity.workoutGoal} min`,
      progress: getGoalProgress(
        activity.workoutMinutes,
        activity.workoutGoal,
      ),
    },
    {
      id: 'weekly-workouts',
      icon: '🏋️',
      label: 'Workouts this week',
      currentLabel: `${activity.weeklyWorkouts}`,
      targetLabel: `${activity.weeklyWorkoutGoal} workouts`,
      progress: getGoalProgress(
        activity.weeklyWorkouts,
        activity.weeklyWorkoutGoal,
      ),
    },
  ];
}

export const profileAvatar = mockCurrentUser.avatar;
export const profileAvatarColor = mockCurrentUser.avatarColor;

export const initialProfile: ProfileData = {
  fullName: mockCurrentUser.name,
  username: mockCurrentUser.username,
  email: 'rawan.ahmed@example.com',
  age: '22',
  gender: 'Female',
};

export const initialPreferences: FitnessPreferences = {
  activities: ['Walking', 'Running', 'Strength Training'],
  challengeTypes: ['Weekly Challenges', 'Steps Challenges'],
};
