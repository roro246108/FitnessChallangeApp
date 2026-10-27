import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import BrowseChallengesScreen from './src/screens/BrowseChallengesScreen';
import RecordWorkoutScreen from './src/screens/RecordWorkoutScreen';
import ChallengeDetailsScreen from './src/screens/ChallengeDetailsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import UploadEvidenceScreen from './src/screens/UploadEvidenceScreen';

import useHomeViewModel from './src/viewmodels/HomeViewModel';
import { ThemeProvider, useTheme } from './src/theme/useTheme';

function AppContent() {
  // One source of truth for the theme: ThemeProvider.
  // The Home view model keeps working, but its darkMode/toggleTheme are replaced here.
  const home = useHomeViewModel();
  const { colors, isDark, toggleTheme } = useTheme();
  const vm = { ...home, darkMode: isDark, toggleTheme };

  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [proofFor, setProofFor] = useState<string | null>(null);

  // Upload Evidence (back returns to the challenge details)
  if (proofFor !== null) {
    return <UploadEvidenceScreen challengeTitle={proofFor} onBack={() => setProofFor(null)} />;
  }

  // Challenge Details (back returns to Browse)
  if (selectedChallengeId !== null) {
    return (
      <ChallengeDetailsScreen
        challengeId={selectedChallengeId}
        onBack={() => setSelectedChallengeId(null)}
        onSubmitProof={setProofFor}
      />
    );
  }

  // Goals screen
  if (vm.activeScreen === 'My Goals') {
    return <GoalsScreen onBack={vm.goHome} onNavigate={vm.navigateTo} />;
  }

  // Browse Challenges screen
  if (vm.activeScreen === 'Challenges') {
    return (
      <BrowseChallengesScreen
        colors={colors}
        darkMode={vm.darkMode}
        onBack={vm.goHome}
        onNavigate={vm.navigateTo}
        onOpenChallenge={setSelectedChallengeId}
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
      <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 42 }}>💪</Text>
        <Text style={[styles.title, { color: colors.text }]}>{vm.activeScreen}</Text>
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

export default function App() {
  return (
    <SafeAreaProvider>
      {/* initialDark keeps the app starting dark, like the Home screen did before */}
      <ThemeProvider initialDark>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', marginTop: 16 },
  subtitle: { marginTop: 8, textAlign: 'center' },
  button: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginTop: 24 },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});