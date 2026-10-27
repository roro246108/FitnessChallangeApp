import { useEffect, useMemo, useState } from 'react';
import { mockChallenge } from '../data/mockChallenge';
import {
  saveChallengeProgress,
  readChallengeProgress,
} from '../data/challengeProgress';
import { getChallenges } from '../models/ActivityModel';
import { ChallengeTab } from '../models/challenge';


export type DetailsTab = ChallengeTab | 'Community';
export const CHALLENGE_TABS: readonly DetailsTab[] = ['Rules', 'Details', 'Rewards', 'Community'];

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
        const all = await readChallengeProgress();
        const mine = all[key];
        if (!cancelled) {
          setJoined(mine ? mine.joined : false);
          setDays(mine ? mine.days : []);
        }
      } catch (error) {
        console.warn('Unable to load challenge progress:', error);
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
        await saveChallengeProgress(key, {
          joined,
          days,
          ...(joined ? {} : { completedDates: {} }),
        });
      } catch (error) {
        console.warn('Unable to save challenge progress:', error);
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

    const participantLabel = selected.participants.trim().toUpperCase();
    const participantValue = Number.parseFloat(participantLabel);
    const participants = participantLabel.endsWith('K')
      ? Math.round(participantValue * 1000)
      : participantValue;
    const targetByCategory = {
      Steps: '10K steps',
      Cardio: '30 min',
      Strength: '1 workout',
      Flexibility: '20 min',
    } as const;
    const rewardPoints = `${selected.reward} points`;

    return {
      ...mockChallenge,
      title: selected.title,
      description: selected.description,
      category: selected.category,
      durationDays: selected.duration,
      participants: Number.isFinite(participants)
        ? participants
        : mockChallenge.participants,
      elapsedDays: selected.day,
      target: targetByCategory[selected.category],
      reward: `${selected.reward} pts`,
      rules: [
        selected.description,
        `Complete the daily target for all ${selected.duration} days.`,
        'Submit workout evidence to track your progress.',
        `Earn ${rewardPoints} when you complete the challenge.`,
      ],
      details: [
        {
          icon: 'calendar-outline',
          title: 'Duration',
          subtitle: `${selected.duration} days`,
        },
        {
          icon: 'speedometer-outline',
          title: 'Daily target',
          subtitle: targetByCategory[selected.category],
        },
        {
          icon: 'people-outline',
          title: 'Participants',
          subtitle: `${selected.participants} joined`,
        },
      ],
      rewards: [
        {
          icon: 'trophy-outline',
          title: 'Challenge badge',
          subtitle: 'Shown on your profile',
        },
        {
          icon: 'star-outline',
          title: rewardPoints,
          subtitle: 'Added when you finish',
        },
        {
          icon: 'ribbon-outline',
          title: 'Top 10 bonus',
          subtitle: '+100 extra points',
        },
      ],
    } as typeof mockChallenge;
  }, [challengeId]);

  return { challenge, joined, toggleJoin, tab, setTab, days, toggleDay };
}