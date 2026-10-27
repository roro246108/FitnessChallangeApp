import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChallenges } from '../models/ActivityModel';

const STORAGE_KEY = 'fitness.challenge-progress.v1';

export type SavedChallengeProgress = {
  joined: boolean;
  days: number[];
  completedDates?: Record<string, number>;
};

export type SavedChallenges = Record<string, SavedChallengeProgress>;

let progressMutationQueue: Promise<void> = Promise.resolve();

function serializeProgressMutation<T>(mutation: () => Promise<T>): Promise<T> {
  const result = progressMutationQueue.then(mutation, mutation);
  progressMutationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function readStoredChallengeProgress(): Promise<SavedChallenges> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) as SavedChallenges : {};
}

async function writeChallengeProgress(
  challengeId: string,
  progress: Partial<SavedChallengeProgress>,
): Promise<void> {
  const saved = await readStoredChallengeProgress();
  const updated = {
    ...saved[challengeId],
    joined: false,
    days: [],
    ...progress,
  };
  if (progress.days && !progress.completedDates) {
    updated.completedDates = Object.fromEntries(
      Object.entries(updated.completedDates ?? {}).filter(([, day]) =>
        updated.days.includes(day),
      ),
    );
  }
  saved[challengeId] = updated;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export async function readChallengeProgress(): Promise<SavedChallenges> {
  try {
    return await readStoredChallengeProgress();
  } catch (error) {
    console.warn('Unable to load joined challenges:', error);
    return {};
  }
}

export async function saveChallengeProgress(
  challengeId: string,
  progress: Partial<SavedChallengeProgress>,
): Promise<void> {
  await serializeProgressMutation(() =>
    writeChallengeProgress(challengeId, progress),
  );
}

export async function completeChallengeDay(
  challengeId: string,
  dateKey: string,
): Promise<boolean> {
  return serializeProgressMutation(async () => {
    const saved = await readStoredChallengeProgress();
    const challenge = saved[challengeId];
    if (!challenge?.joined || challenge.completedDates?.[dateKey]) return false;

    const duration = Math.max(
      1,
      getChallenges().find((item) => item.id === challengeId)?.duration ?? 1,
    );
    const days = [...new Set(challenge.days)].filter(
      (day) => Number.isInteger(day) && day >= 1 && day <= duration,
    );
    let nextDay = 1;
    while (days.includes(nextDay) && nextDay <= duration) nextDay += 1;
    if (nextDay > duration) return false;

    saved[challengeId] = {
      ...challenge,
      days: [...days, nextDay],
      completedDates: {
        ...challenge.completedDates,
        [dateKey]: nextDay,
      },
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  });
}

export async function rejectChallengeDay(
  challengeId: string,
  dateKey: string,
): Promise<boolean> {
  return serializeProgressMutation(async () => {
    const saved = await readStoredChallengeProgress();
    const challenge = saved[challengeId];
    const completedDay = challenge?.completedDates?.[dateKey];
    if (!challenge || completedDay === undefined) return false;

    const completedDates = { ...challenge.completedDates };
    delete completedDates[dateKey];
    saved[challengeId] = {
      ...challenge,
      days: challenge.days.filter((day) => day !== completedDay),
      completedDates,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  });
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
