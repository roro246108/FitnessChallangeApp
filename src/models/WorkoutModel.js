
export const WORKOUT_TYPES = [
  { id: 'Running', label: 'Running', icon: '👟', caloriesPerMinute: 8 },
  { id: 'Strength', label: 'Strength', icon: '🏋️', caloriesPerMinute: 6 },
  { id: 'Cardio', label: 'Cardio', icon: '❤️', caloriesPerMinute: 9 },
  { id: 'Yoga', label: 'Yoga', icon: '🧘', caloriesPerMinute: 3 },
];

export const EFFORT_LEVELS = [
  { id: 'Easy', label: 'Easy', multiplier: 0.8, color: '#CDFF7E' },
  { id: 'Moderate', label: 'Moderate', multiplier: 1, color: '#A38DF2' },
  { id: 'Intense', label: 'Intense', multiplier: 1.3, color: '#FF6B9A' },
];

export const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const estimateCalories = (type, duration, effort) => {
  const workout = WORKOUT_TYPES.find((item) => item.id === type);
  const level = EFFORT_LEVELS.find((item) => item.id === effort);

  if (!workout || !level) return 0;

  return Math.round(
    workout.caloriesPerMinute * duration * level.multiplier
  );
};
