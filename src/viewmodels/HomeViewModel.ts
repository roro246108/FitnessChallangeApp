import { useMemo, useState } from 'react';
import {
  getAchievements,
  getActiveChallenges,
  getActivityData,
  getChallenges,
} from '../models/ActivityModel';

export default function useHomeViewModel() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>(['Home']);

  const activeScreen = history[history.length - 1];

  const activity = useMemo(() => getActivityData(), []);
  const challenges = useMemo(() => getChallenges(), []);
  const activeChallenges = useMemo(() => getActiveChallenges(), []);
  const achievements = useMemo(() => getAchievements(), []);

  const toggleTheme = (): void => {
    setDarkMode((current) => !current);
  };

  const navigateTo = (screen: string): void => {
    if (screen === 'Home') {
      setHistory(['Home']);
      return;
    }

    setHistory((current) =>
      current[current.length - 1] === screen
        ? current
        : [...current, screen],
    );
  };

  const goHome = (): void => {
    setHistory(['Home']);
  };

  const goBack = (): void => {
    setHistory((current) =>
      current.length > 1 ? current.slice(0, -1) : ['Home'],
    );
  };

  return {
    darkMode,
    toggleTheme,
    activeScreen,
    navigateTo,
    goHome,
    goBack,
    activity,
    challenges,
    activeChallenges,
    achievements,
  };
}
