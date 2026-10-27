import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GoalRange = 'Day' | 'Week' | 'Month';
export type GoalCategory = 'Steps' | 'Cardio' | 'Strength' | 'Flexibility' | 'Water';
export type GoalFilter = 'All' | 'Active' | 'Done';

export const GOAL_RANGES: GoalRange[] = ['Day', 'Week', 'Month'];
export const GOAL_CATEGORIES: GoalCategory[] = ['Steps', 'Cardio', 'Strength', 'Flexibility', 'Water'];
export const GOAL_FILTERS: GoalFilter[] = ['All', 'Active', 'Done'];

export const CATEGORY_UNIT: Record<GoalCategory, string> = {
  Steps: 'steps',
  Cardio: 'min',
  Strength: 'reps',
  Flexibility: 'min',
  Water: 'glasses',
};

// How much one tap on "Log progress" adds
const CATEGORY_STEP: Record<GoalCategory, number> = {
  Steps: 1000,
  Cardio: 10,
  Strength: 10,
  Flexibility: 5,
  Water: 1,
};

const STORAGE_KEY = 'fitness.goals.v1';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  unit: string;
  target: number;
  current: number;
  period: GoalRange;
}

export interface NewGoalInput {
  title: string;
  category: GoalCategory;
  target: number;
  period: GoalRange;
}

interface RangeData {
  periodLabel: string;
  steps: { current: number; goal: number };
  change: number; // % vs previous period
  compareLabel: string;
  stats: { icon: string; value: string; label: string }[];
  chart: { labels: string[]; values: number[]; goalLine: number; unitLabel: string };
}

export const RANGE_DATA: Record<GoalRange, RangeData> = {
  Day: {
    periodLabel: 'Steps today',
    steps: { current: 6240, goal: 10000 },
    change: 8,
    compareLabel: 'vs yesterday',
    stats: [
      { icon: '🔥', value: '420', label: 'Calories' },
      { icon: '🏃', value: '1', label: 'Workouts' },
      { icon: '⏱', value: '48m', label: 'Active time' },
    ],
    chart: {
      labels: ['6a', '9a', '12p', '3p', '6p', '9p'],
      values: [800, 1500, 900, 1200, 1400, 440],
      goalLine: 1700,
      unitLabel: 'Steps per 3 hours',
    },
  },
  Week: {
    periodLabel: 'Steps this week',
    steps: { current: 52400, goal: 70000 },
    change: 12,
    compareLabel: 'vs last week',
    stats: [
      { icon: '🔥', value: '2,940', label: 'Calories' },
      { icon: '🏃', value: '5', label: 'Workouts' },
      { icon: '⏱', value: '5h 20m', label: 'Active time' },
    ],
    chart: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [8200, 9100, 6400, 10300, 7800, 5600, 5000],
      goalLine: 10000,
      unitLabel: 'Steps per day',
    },
  },
  Month: {
    periodLabel: 'Steps this month',
    steps: { current: 214000, goal: 300000 },
    change: 5,
    compareLabel: 'vs last month',
    stats: [
      { icon: '🔥', value: '12,600', label: 'Calories' },
      { icon: '🏃', value: '21', label: 'Workouts' },
      { icon: '⏱', value: '22h', label: 'Active time' },
    ],
    chart: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      values: [48000, 56000, 61000, 49000],
      goalLine: 75000,
      unitLabel: 'Steps per week',
    },
  },
};

export const STREAK = {
  days: 12,
  best: 21,
  last7: [true, true, true, false, true, true, true],
  dayLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
};

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Daily steps', category: 'Steps', unit: 'steps', target: 10000, current: 6240, period: 'Day' },
  { id: 'g2', title: 'Drink water', category: 'Water', unit: 'glasses', target: 8, current: 5, period: 'Day' },
  { id: 'g3', title: 'Morning cardio', category: 'Cardio', unit: 'min', target: 30, current: 30, period: 'Day' },
  { id: 'g4', title: 'Strength training', category: 'Strength', unit: 'reps', target: 200, current: 120, period: 'Week' },
  { id: 'g5', title: 'Weekly running', category: 'Cardio', unit: 'min', target: 150, current: 95, period: 'Week' },
  { id: 'g6', title: 'Stretching', category: 'Flexibility', unit: 'min', target: 60, current: 45, period: 'Week' },
  { id: 'g7', title: 'Monthly steps', category: 'Steps', unit: 'steps', target: 300000, current: 214000, period: 'Month' },
  { id: 'g8', title: 'Cardio minutes', category: 'Cardio', unit: 'min', target: 600, current: 380, period: 'Month' },
];

export default function useMyGoalsViewModel() {
  const [range, setRange] = useState<GoalRange>('Day');
  const [filter, setFilter] = useState<GoalFilter>('All');
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [loaded, setLoaded] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [celebrate, setCelebrate] = useState<Goal | null>(null);

  // load saved goals once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setGoals(JSON.parse(raw) as Goal[]);
      } catch {
        // storage is optional: keep the default goals
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // save on every change (after the first load, so defaults don't overwrite saved data)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals)).catch(() => {});
  }, [goals, loaded]);

  const data = RANGE_DATA[range];
  const percent = Math.min(Math.round((data.steps.current / data.steps.goal) * 100), 100);

  const rangeGoals = useMemo(() => goals.filter((g) => g.period === range), [goals, range]);

  const visibleGoals = useMemo(() => {
    if (filter === 'Active') return rangeGoals.filter((g) => g.current < g.target);
    if (filter === 'Done') return rangeGoals.filter((g) => g.current >= g.target);
    return rangeGoals;
  }, [rangeGoals, filter]);

  const completedCount = rangeGoals.filter((g) => g.current >= g.target).length;

  const addProgress = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal || goal.current >= goal.target) return;
    const next = Math.min(goal.current + CATEGORY_STEP[goal.category], goal.target);
    setGoals((list) => list.map((g) => (g.id === id ? { ...g, current: next } : g)));
    if (next >= goal.target) setCelebrate({ ...goal, current: next });
  };

  const toggleComplete = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const wasDone = goal.current >= goal.target;
    setGoals((list) =>
      list.map((g) => (g.id === id ? { ...g, current: wasDone ? 0 : g.target } : g)),
    );
    if (!wasDone) setCelebrate({ ...goal, current: goal.target });
  };

  const deleteGoal = (id: string) => setGoals((list) => list.filter((g) => g.id !== id));

  const addGoal = (input: NewGoalInput) => {
    const goal: Goal = {
      id: `g${Date.now()}`,
      title: input.title.trim(),
      category: input.category,
      unit: CATEGORY_UNIT[input.category],
      target: input.target,
      current: 0,
      period: input.period,
    };
    setGoals((list) => [goal, ...list]);
    setRange(input.period); // jump to the tab where the new goal lives
    setFilter('All');
  };

  const editGoal = (id: string, input: NewGoalInput) => {
    setGoals((list) =>
      list.map((g) =>
        g.id === id
          ? {
              ...g,
              title: input.title.trim(),
              category: input.category,
              unit: CATEGORY_UNIT[input.category],
              target: input.target,
              period: input.period,
              current: Math.min(g.current, input.target),
            }
          : g,
      ),
    );
    setRange(input.period);
    setFilter('All');
  };

  const saveGoal = (input: NewGoalInput) => {
    if (editing) editGoal(editing.id, input);
    else addGoal(input);
  };

  return {
    range,
    setRange,
    filter,
    setFilter,
    data,
    percent,
    visibleGoals,
    rangeGoalsCount: rangeGoals.length,
    completedCount,
    addProgress,
    toggleComplete,
    deleteGoal,
    saveGoal,
    formVisible,
    editing,
    openForm: () => {
      setEditing(null);
      setFormVisible(true);
    },
    openEdit: (goal: Goal) => {
      setEditing(goal);
      setFormVisible(true);
    },
    closeForm: () => {
      setFormVisible(false);
      setEditing(null);
    },
    celebrate,
    dismissCelebrate: () => setCelebrate(null),
  };
}