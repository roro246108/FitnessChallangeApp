
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getChallenges,
  type ChallengeCategory,
} from '../models/ActivityModel';
import {
  readChallengeProgress,
  type SavedChallenges,
} from '../data/challengeProgress';

export type MyChallengeFilter = 'All' | 'Active' | 'Completed';

export type JoinedChallenge = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  durationDays: number;
  participants: string;
  reward: number;
  completedDays: number;
  progress: number;
  daysLeft: number;
  isCompleted: boolean;
};

export default function useMyChallengesViewModel() {
  const [saved, setSaved] = useState<SavedChallenges>({});
  const [filter, setFilter] = useState<MyChallengeFilter>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void readChallengeProgress().then((challenges) => {
      if (active) {
        setSaved(challenges);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setSaved(await readChallengeProgress());
    setLoading(false);
  }, []);

  const challenges = useMemo<JoinedChallenge[]>(() => {
    return getChallenges()
      .filter((challenge) => saved[challenge.id]?.joined === true)
      .map((challenge) => {
        const durationDays = Math.max(1, challenge.duration);
        const completedDays = Math.min(
          durationDays,
          new Set(saved[challenge.id]?.days ?? []).size,
        );

        const progress = Math.round(
          (completedDays / durationDays) * 100,
        );

        return {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          durationDays,
          participants: challenge.participants,
          reward: challenge.reward,
          completedDays,
          progress,
          daysLeft: Math.max(0, durationDays - completedDays),
          isCompleted: completedDays >= durationDays,
        };
      });
  }, [saved]);

  const filteredChallenges = useMemo(() => {
    if (filter === 'Active') {
      return challenges.filter((challenge) => !challenge.isCompleted);
    }

    if (filter === 'Completed') {
      return challenges.filter((challenge) => challenge.isCompleted);
    }

    return challenges;
  }, [challenges, filter]);

  const activeCount = challenges.filter(
    (challenge) => !challenge.isCompleted,
  ).length;

  const completedCount = challenges.filter(
    (challenge) => challenge.isCompleted,
  ).length;

  return {
    filter,
    setFilter,
    challenges: filteredChallenges,
    activeCount,
    completedCount,
    totalCount: challenges.length,
    loading,
    refresh,
  };
}
