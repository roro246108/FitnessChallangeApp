
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
    if (!date.trim()) {
      setError('Please enter a workout date.');
      return false;
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    const validDate =
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === date;

    if (!validDate) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return false;
    }

    if (parsedDate > new Date(`${getTodayDate()}T23:59:59`)) {
      setError('Workout date cannot be in the future.');
      return false;
    }

    if (
      !Number.isFinite(duration) ||
      duration < 1 ||
      duration > 300
    ) {
      setError('Duration must be between 1 and 300 minutes.');
      return false;
    }

    const workout: Workout = {
      id: editingId ?? `${Date.now()}`,
      type: workoutType,
      duration,
      date,
      notes: notes.trim(),
      effort,
      calories,
    };

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
