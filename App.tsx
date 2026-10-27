import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FriendsScreen from './src/screens/FriendsScreen';
import BrowseChallengesScreen from './src/screens/BrowseChallengesScreen';
import HomeScreen from './src/screens/HomeScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecordWorkoutScreen from './src/screens/RecordWorkoutScreen';

import useFriendsViewModel from './src/viewmodels/FriendsViewModel';
import useHomeViewModel from './src/viewmodels/HomeViewModel';
import useLeaderboardViewModel from './src/viewmodels/LeaderboardViewModel';
import useProfileViewModel from './src/viewmodels/ProfileViewModel';
import { darkColors, lightColors } from './src/theme/Color';
import type { Colors } from './src/theme/Color';

function AppContent() {
  const vm = useHomeViewModel();
  const profileVm = useProfileViewModel(vm.activity);
  const friendsVm = useFriendsViewModel(profileVm.profile.username);
  const leaderboardVm = useLeaderboardViewModel({
    currentUserName: profileVm.profile.fullName,
    currentUserUsername: profileVm.profile.username,
    currentUserInitials: profileVm.initials,
    friends: friendsVm.friends,
  });
  const firstName =
    profileVm.profile.fullName.trim().split(/\s+/)[0] || 'there';
  const colors: Colors = vm.darkMode ? darkColors : lightColors;

  if (vm.activeScreen === 'Challenges') {
    return (
      <BrowseChallengesScreen
        colors={colors}
        darkMode={vm.darkMode}
        onBack={vm.goBack}
        onNavigate={vm.navigateTo}
      />
    );
  }

  if (vm.activeScreen === 'Record Workout') {
    return (
      <RecordWorkoutScreen
        colors={colors}
        darkMode={vm.darkMode}
        onBack={vm.goBack}
        onNavigate={vm.navigateTo}
      />
    );
  }

  if (vm.activeScreen === 'Leaderboard') {
    return (
      <LeaderboardScreen
        colors={colors}
        darkMode={vm.darkMode}
        vm={leaderboardVm}
        onBack={vm.goBack}
        onNavigate={vm.navigateTo}
      />
    );
  }

  if (vm.activeScreen === 'Profile') {
    return (
      <ProfileScreen
        colors={colors}
        darkMode={vm.darkMode}
        activity={vm.activity}
        activeChallenges={vm.activeChallenges}
        achievements={leaderboardVm.achievements}
        levelInfo={leaderboardVm.levelInfo}
        unlockedAchievements={leaderboardVm.unlockedCount}
        totalAchievements={leaderboardVm.achievements.length}
        totalPoints={leaderboardVm.totalPoints}
        vm={profileVm}
        onBack={vm.goBack}
        onNavigate={vm.navigateTo}
        onToggleTheme={vm.toggleTheme}
      />
    );
  }

  if (vm.activeScreen === 'Friends') {
    return (
      <FriendsScreen
        colors={colors}
        darkMode={vm.darkMode}
        vm={friendsVm}
        onBack={vm.goBack}
        onNavigate={vm.navigateTo}
      />
    );
  }

  if (vm.activeScreen !== 'Home') {
    return (
      <View
        style={[
          styles.placeholder,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ fontSize: 42 }}>💪</Text>

        <Text style={[styles.title, { color: colors.text }]}>
          {vm.activeScreen}
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          This screen will be implemented next.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={vm.goHome}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <HomeScreen vm={vm} colors={colors} firstName={firstName} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
