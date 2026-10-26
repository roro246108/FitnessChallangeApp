
import { useMemo, useState } from 'react';
import {
  getActivityData,
  getChallenges,
  getAchievements,
} from '../models/ActivityModel';

export default function useHomeViewModel() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeScreen, setActiveScreen] = useState('Home');

  const activity = useMemo(() => getActivityData(), []);
  const challenges = useMemo(() => getChallenges(), []);
  const achievements = useMemo(() => getAchievements(), []);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  const navigateTo = (screen) => {
    setActiveScreen(screen);
  };

  const goHome = () => {
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
