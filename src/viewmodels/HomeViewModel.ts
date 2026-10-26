
import { useMemo, useState } from 'react';
import {
  getActivityData,
  getChallenges,
  getAchievements,
} from '../models/ActivityModel';

export default function useHomeViewModel() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<string>('Home');

  const activity = useMemo(() => getActivityData(), []);
  const challenges = useMemo(() => getChallenges(), []);
  const achievements = useMemo(() => getAchievements(), []);

  const toggleTheme = (): void => {
    setDarkMode((current) => !current);
  };

  const navigateTo = (screen: string): void => {
    setActiveScreen(screen);
  };

  const goHome = (): void => {
    setActiveScreen('Home');
  };

  return {
    darkMode,
    toggleTheme,
    activeScreen,
    navigateTo,
    goHome,
    activity,
    challenges,
    achievements,
  };
}
