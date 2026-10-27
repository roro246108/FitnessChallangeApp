
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import BrowseChallengesScreen from './src/screens/BrowseChallengesScreen';
import RecordWorkoutScreen from './src/screens/RecordWorkoutScreen';

import AdminDashboard from './src/screens/AdminDashboard';
import ManageChallengesScreen from './src/screens/ManageChallengesScreen';
import ManageUsersReportsScreen from './src/screens/ManageUsersReportsScreen';

import useHomeViewModel from './src/viewmodels/HomeViewModel';
import useAdminViewModel from './src/viewmodels/AdminViewModel';

import { lightColors, darkColors } from './src/theme/Color';
import type { Colors } from './src/theme/Color';

export default function App() {
  const vm = useHomeViewModel();

  // Keep admin data available while switching between screens.
  // Hooks must run before any conditional returns.
  const adminVm = useAdminViewModel();

  const colors: Colors = vm.darkMode ? darkColors : lightColors;

  // Shared props for the three admin screens.
  const adminProps = {
    colors,
    darkMode: vm.darkMode,
    onToggleTheme: vm.toggleTheme,
    onNavigate: vm.navigateTo,
    onBack: () => vm.navigateTo('Admin Dashboard'),
    vm: adminVm,
  };

  // Admin screens must appear before the temporary-screen fallback.
  if (vm.activeScreen === 'Admin Dashboard') {
    return <AdminDashboard {...adminProps} onBack={vm.goHome} />;
  }

  if (vm.activeScreen === 'Manage Challenges') {
    return <ManageChallengesScreen {...adminProps} />;
  }

  if (vm.activeScreen === 'Manage Users & Reports') {
    return <ManageUsersReportsScreen {...adminProps} />;
  }

  // Browse Challenges screen
  if (vm.activeScreen === 'Challenges') {
    return (
      <BrowseChallengesScreen
        colors={colors}
        darkMode={vm.darkMode}
        onBack={vm.goHome}
        onNavigate={vm.navigateTo}
      />
    );
  }

  // Record Workout screen
  if (vm.activeScreen === 'Record Workout') {
    return (
      <RecordWorkoutScreen
        colors={colors}
        darkMode={vm.darkMode}
        onBack={vm.goHome}
        onNavigate={vm.navigateTo}
      />
    );
  }

  // Temporary screens
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

  // Home screen
  return <HomeScreen vm={vm} colors={colors} />;
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