
export const getActivityData = () => ({
  steps: 7542,
  stepsGoal: 10000,
  calories: 320,
  caloriesGoal: 500,
  workoutMinutes: 45,
  workoutGoal: 60,
  streak: 5,
});

export const getChallenges = () => [
  {
    id: 'steps-7',
    title: '7-Day Step Challenge',
    description: 'Take 10,000 steps daily for 7 days and build a healthy habit!',
    category: 'Steps',
    duration: 7,
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
    reward: 120,
    participants: '5.4K',
    icon: '❤️',
    popular: true,
  },
];

export const getAchievements = () => [
  { id: 'steps', icon: '👟', title: 'Step Starter' },
  { id: 'calories', icon: '🔥', title: 'Calorie Burner' },
  { id: 'challenge', icon: '🏆', title: 'Challenge Pro' },
  { id: 'streak', icon: '⚡', title: '5 Day Streak' },
];
