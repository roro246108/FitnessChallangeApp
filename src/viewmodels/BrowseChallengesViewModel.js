
import { useMemo, useState } from 'react';
import { getChallenges } from '../models/ActivityModel';

export default function useBrowseChallengesViewModel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [joinedChallenges, setJoinedChallenges] = useState([]);

  const categories = ['All', 'Steps', 'Cardio', 'Strength', 'Flexibility'];

  const challenges = useMemo(() => {
    const allChallenges = getChallenges();

    return allChallenges.filter((challenge) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        challenge.category === selectedCategory;

      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleJoin = (challengeId) => {
    setJoinedChallenges((current) =>
      current.includes(challengeId)
        ? current.filter((id) => id !== challengeId)
        : [...current, challengeId]
    );
  };

  return {
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    challenges,
    joinedChallenges,
    toggleJoin,
  };
}
