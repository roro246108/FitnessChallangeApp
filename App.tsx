
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import FriendsScreen from './src/screens/FriendsScreen';
import BrowseChallengesScreen from './src/screens/BrowseChallengesScreen';
import HomeScreen from './src/screens/HomeScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecordWorkoutScreen from './src/screens/RecordWorkoutScreen';
import ChallengeDetailsScreen from './src/screens/ChallengeDetailsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import UploadEvidenceScreen from './src/screens/UploadEvidenceScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import AdminDashboard from './src/screens/AdminDashboard';
import ManageChallengesScreen from './src/screens/ManageChallengesScreen';
import ManageUsersReportsScreen from './src/screens/ManageUsersReportsScreen';

import useLeaderboardViewModel from './src/viewmodels/LeaderboardViewModel';
import useProfileViewModel from './src/viewmodels/ProfileViewModel';
import useAuthViewModel from './src/viewmodels/AuthViewModel';
import useAdminViewModel from './src/viewmodels/AdminViewModel';
import useFriendsViewModel from './src/viewmodels/FriendsViewModel';
import useHomeViewModel from './src/viewmodels/HomeViewModel';

import { ThemeProvider, useTheme } from './src/theme/useTheme';

function AppContent() {
  // 1. Theme and home state
  const home = useHomeViewModel();
  const { colors, isDark, toggleTheme } = useTheme();

  const vm = {
    ...home,
    darkMode: isDark,
    toggleTheme,
  };

  // 2. Other ViewModels
  const adminVm = useAdminViewModel();
  const profileVm = useProfileViewModel(vm.activity);
  const friendsVm = useFriendsViewModel(
    profileVm.profile.username
  );

  const leaderboardVm = useLeaderboardViewModel({
    currentUserName: profileVm.profile.fullName,
    currentUserUsername: profileVm.profile.username,
    currentUserInitials: profileVm.initials,
    friends: friendsVm.friends,
  });

  const auth = useAuthViewModel();

  // 3. Navigation state
  const [selectedChallengeId, setSelectedChallengeId] =
    useState<string | null>(null);

  const [proofFor, setProofFor] =
    useState<string | null>(null);

  const firstName =
    profileVm.profile.fullName.trim().split(/\s+/)[0] ||
    'there';

  // 4. Shared props for admin screens
  const adminProps = {
    colors,
    darkMode: vm.darkMode,
    onToggleTheme: vm.toggleTheme,
    onNavigate: vm.navigateTo,
    onBack: () => vm.navigateTo('Admin Dashboard'),
    vm: adminVm,
  };

  // 5. Authentication screens
  if (auth.authScreen === 'Onboarding') {
    return (
      <OnboardingScreen
        onGetStarted={auth.showLogin}
      />
    );
  }

  if (auth.authScreen === 'Login') {
    return (
      <LoginScreen
        onLogin={auth.login}
        onRegister={auth.showRegister}
        onForgotPassword={auth.forgotPassword}
      />
    );
  }

  if (auth.authScreen === 'Register') {
    return (
      <RegisterScreen
        onRegister={auth.register}
        onLogin={auth.showLogin}
      />
    );
  }

  // 6. Upload evidence screen
  if (proofFor !== null) {
    return (
      <UploadEvidenceScreen
        challengeTitle={proofFor}
        onBack={() => setProofFor(null)}
      />
    );
  }

  // 7. Challenge details screen
  if (selectedChallengeId !== null) {
    return (
      <ChallengeDetailsScreen
        challengeId={selectedChallengeId}
        onBack={() => setSelectedChallengeId(null)}
        onSubmitProof={setProofFor}
      />
    );
  }

  // 8. Goals screen
  if (vm.activeScreen === 'My Goals') {
    return (
      <GoalsScreen
        onBack={vm.goHome}
        onNavigate={vm.navigateTo}
      />
    );
  }

  // 9. Admin screens
  if (vm.activeScreen === 'Admin Dashboard') {
    return (
      <AdminDashboard
        {...adminProps}
        onBack={vm.goHome}
      />
    );
  }

  if (vm.activeScreen === 'Manage Challenges') {
    return (
      <ManageChallengesScreen {...adminProps} />
    );
  }

  if (vm.activeScreen === 'Manage Users & Reports') {
    return (
      <ManageUsersReportsScreen {...adminProps} />
    );
  }

  // 10. Browse challenges
  if (vm.activeScreen === 'Challenges') {
    return (
      <BrowseChallengesScreen
        colors={colors}
        darkMode={vm.darkMode}
        onBack={vm.goBack}
        onNavigate={vm.navigateTo}
        onOpenChallenge={setSelectedChallengeId}
      />
    );
  }

  // 11. Record workout
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

  // 12. Leaderboard
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

  // 13. Profile
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

  // 14. Friends
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

  // 15. Existing placeholder screens
  if (vm.activeScreen !== 'Home') {
    return (
      <View
        style={[
          styles.placeholder,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ fontSize: 42 }}>💪</Text>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {vm.activeScreen}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.muted },
          ]}
        >
          This screen will be implemented next.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
          ]}
          onPress={vm.goHome}
        >
          <Text style={styles.buttonText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 16. Home screen
  return (
    <HomeScreen
      vm={vm}
      colors={colors}
      firstName={firstName}
    />
  );
}

// App entry point: only one default export
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialDark>
        <AppContent />
      </ThemeProvider>
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
