
import { useMemo, useState } from 'react';
import {
  WORKOUT_TYPES,
  EFFORT_LEVELS,
  getTodayDate,
  estimateCalories,
} from '../models/WorkoutModel';

type WorkoutType = (typeof WORKOUT_TYPES)[number]['id'];
type EffortLevel = (typeof EFFORT_LEVELS)[number]['id'];

interface Workout {
  id: string;
  type: WorkoutType;
  duration: number;
  date: string;
  notes: string;
  effort: EffortLevel;
  calories: number;
}

export default function useRecordWorkoutViewModel() {
  const [workoutType, setWorkoutType] =
    useState<WorkoutType>('Running');

  const [duration, setDuration] = useState<number>(45);
  const [date, setDate] = useState<string>(getTodayDate());
  const [notes, setNotes] = useState<string>('');
  const [effort, setEffort] =
    useState<EffortLevel>('Moderate');

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const calories = useMemo(
    () => estimateCalories(workoutType, duration, effort),
    [workoutType, duration, effort]
  );

  const updateDuration = (amount: number): void => {
    setDuration((current) =>
      Math.max(1, Math.min(300, current + amount))
    );

    setError('');
    setMessage('');
  };

  const resetForm = (): void => {
    setWorkoutType('Running');
    setDuration(45);
    setDate(getTodayDate());
    setNotes('');
    setEffort('Moderate');
    setEditingId(null);
    setError('');
    setMessage('');
  };

  const editWorkout = (workout: Workout): void => {
    setWorkoutType(workout.type);
    setDuration(workout.duration);
    setDate(workout.date);
    setNotes(workout.notes);
    setEffort(workout.effort);
    setEditingId(workout.id);
    setError('');
    setMessage('');
  };

  const saveWorkout = (): boolean => {
    const trimmedDate = date.trim();

    // 1. Check that the date is not empty.
    if (!trimmedDate) {
      setError('Please enter a workout date.');
      return false;
    }

    // 2. Validate YYYY-MM-DD format.
    const dateMatch =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedDate);

    if (!dateMatch) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return false;
    }

    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3]);

    // 3. Validate the actual calendar date using local time.
    // Do not use toISOString(), because it converts to UTC.
    const parsedDate = new Date(year, month - 1, day);

    const validDate =
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day;

    if (!validDate) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return false;
    }

    // 4. Prevent future workout dates.
    // Both values use YYYY-MM-DD, so string comparison is safe.
    if (trimmedDate > getTodayDate()) {
      setError('Workout date cannot be in the future.');
      return false;
    }

    // 5. Validate workout duration.
    if (
      !Number.isFinite(duration) ||
      duration < 1 ||
      duration > 300
    ) {
      setError('Duration must be between 1 and 300 minutes.');
      return false;
    }

    // 6. Create the workout.
    const workout: Workout = {
      id: editingId ?? `${Date.now()}`,
      type: workoutType,
      duration,
      date: trimmedDate,
      notes: notes.trim(),
      effort,
      calories,
    };

    // 7. Update an existing workout or save a new one.
    if (editingId !== null) {
      setWorkouts((current) =>
        current.map((item) =>
          item.id === editingId ? workout : item
        )
      );

      setMessage('Workout updated successfully!');
    } else {
      setWorkouts((current) => [workout, ...current]);

      setMessage('Workout saved successfully!');
    }

    setEditingId(null);
    setError('');

    return true;
  };

  return {
    workoutTypes: WORKOUT_TYPES,
    effortLevels: EFFORT_LEVELS,

    workoutType,
    setWorkoutType,

    duration,
    updateDuration,

    date,
    setDate,

    notes,
    setNotes,

    effort,
    setEffort,

    calories,

    workouts,
    editingId,
    editWorkout,

    saveWorkout,
    resetForm,

    error,
    message,

    clearMessage: (): void => setMessage(''),
  };
}
