
import { useMemo, useState } from 'react';
import { getChallenges } from '../models/ActivityModel';
import type {
  Challenge,
  ChallengeCategory as ChallengeType,
} from '../models/ActivityModel';

export type ChallengeCategory = 'All' | ChallengeType;

export default function useBrowseChallengesViewModel() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<ChallengeCategory>('All');

  const categories: ChallengeCategory[] = [
    'All',
    'Steps',
    'Cardio',
    'Strength',
    'Flexibility',
  ];

  const challenges = useMemo<Challenge[]>(() => {
    const allChallenges = getChallenges();
    const query = searchQuery.trim().toLowerCase();

    return allChallenges.filter((challenge) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        challenge.category === selectedCategory;

      const matchesSearch =
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return {
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    challenges,
  };
}
