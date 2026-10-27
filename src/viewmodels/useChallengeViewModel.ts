import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockChallenge } from '../data/mockChallenge';
import { getChallenges } from '../models/ActivityModel';
import { ChallengeTab } from '../models/challenge';


export type DetailsTab = ChallengeTab | 'Community';
export const CHALLENGE_TABS: readonly DetailsTab[] = ['Rules', 'Details', 'Rewards', 'Community'];
const STORAGE_KEY = 'fitness.challenge-progress.v1';

// one entry per challenge id: are we joined, and which days were checked in
type Saved = Record<string, { joined: boolean; days: number[] }>;

export function useChallengeViewModel(challengeId?: string) {
  const key = challengeId ?? 'default';

    const [tab, setTab] = useState<DetailsTab>('Rules');
  const [joined, setJoined] = useState(false);
  const [days, setDays] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  // load what was saved for this challenge
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const all: Saved = raw ? JSON.parse(raw) : {};
        const mine = all[key];
        if (!cancelled) {
          setJoined(mine ? mine.joined : false);
          setDays(mine ? mine.days : []);
        }
      } catch {
        // storage is optional: start empty
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  // save whenever joined/days change (only after the load finished)
  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const all: Saved = raw ? JSON.parse(raw) : {};
        all[key] = { joined, days };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch {
        // ignore storage errors
      }
    })();
  }, [joined, days, ready, key]);

  const toggleJoin = () => {
    if (joined) setDays([]); // withdrawing clears the progress
    setJoined((v) => !v);
  };

  const toggleDay = (day: number) =>
    setDays((cur) => (cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day]));

  // the tapped challenge, with the remaining details (rules, rewards...) taken from the mock
  const challenge = useMemo(() => {
    const selected = getChallenges().find((c) => c.id === challengeId);
    if (!selected) return mockChallenge;

    return {
      ...mockChallenge,
      title: selected.title,
      description: selected.description,
      category: selected.category,
      durationDays: selected.duration,
      participants: Number(selected.participants) || mockChallenge.participants,
      reward: `${selected.reward} pts`,
    } as typeof mockChallenge;
  }, [challengeId]);

  return { challenge, joined, toggleJoin, tab, setTab, days, toggleDay };
}