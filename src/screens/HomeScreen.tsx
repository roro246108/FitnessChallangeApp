
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import ActivitySummary from '../components/ActivitySummary';
import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import ChallengeCard from '../components/ChallengeCard';
import type { Colors } from '../theme/Color';
import useHomeViewModel from '../viewmodels/HomeViewModel';

interface HomeScreenProps {
  vm: ReturnType<typeof useHomeViewModel>;
  colors: Colors;
  firstName: string;
}

export default function HomeScreen({
  vm,
  colors,
  firstName,
}: HomeScreenProps) {
  const actions = [
    { icon: '🏃', title: 'Log Workout', screen: 'Record Workout' },
    { icon: '⚑', title: 'My Goals', screen: 'My Goals' },
    { icon: '🏆', title: 'Challenges', screen: 'Challenges' },
    { icon: '👥', title: 'Friends', screen: 'Friends' },
  ];

  const progressItems = [
    {
      icon: '👟',
      label: 'Steps',
      value: vm.activity.steps,
      goal: vm.activity.stepsGoal.toLocaleString(),
      progress: (vm.activity.steps / vm.activity.stepsGoal) * 100,
      color: colors.primary,
    },
    {
      icon: '◷',
      label: 'Workout Time',
      value: vm.activity.workoutMinutes,
      goal: `${vm.activity.workoutGoal} mins`,
      progress:
        (vm.activity.workoutMinutes / vm.activity.workoutGoal) * 100,
      color: colors.lavender,
    },
    {
      icon: '🔥',
      label: 'Calories',
      value: vm.activity.calories,
      goal: `${vm.activity.caloriesGoal} kcal`,
      progress:
        (vm.activity.calories / vm.activity.caloriesGoal) * 100,
      color: colors.lime,
    },
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar style={vm.darkMode ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <BrandHeader />
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hello {firstName}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Keep moving, you&apos;re doing great!
            </Text>
          </View>

        </View>

        <ActivitySummary activity={vm.activity} colors={colors} />

        <View style={styles.actions}>
          {actions.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => vm.navigateTo(item.screen)}
              style={[
                styles.action,
                {
                  backgroundColor:
                    item.title === 'Log Workout'
                      ? colors.primary
                      : colors.card,
                },
              ]}
            >
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.actionText,
                  {
                    color:
                      item.title === 'Log Workout' ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Challenges
            </Text>
            <TouchableOpacity onPress={() => vm.navigateTo('Challenges')}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {vm.challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              colors={colors}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Progress
            </Text>
            <TouchableOpacity onPress={() => vm.navigateTo('My Goals')}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            {progressItems.map((item) => (
              <View
                key={item.label}
                style={[styles.progressCard, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.progressLabel, { color: colors.text }]}>
                  {item.icon} {item.label}
                </Text>
                <Text style={[styles.progressValue, { color: colors.text }]}>
                  {item.value.toLocaleString()}
                </Text>
                <Text style={[styles.progressGoal, { color: colors.muted }]}>
                  / {item.goal}
                </Text>
                <View style={[styles.progressTrack, { backgroundColor: colors.track }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(0, item.progress))}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav
        colors={colors}
        activeScreen={vm.activeScreen}
        onNavigate={vm.navigateTo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 5 },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  action: {
    flex: 1,
    minWidth: 0,
    height: 78,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  actionIcon: { fontSize: 23, marginBottom: 6 },
  actionText: { fontSize: 10, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  progressRow: { flexDirection: 'row', gap: 8 },
  progressCard: {
    flex: 1,
    minWidth: 0,
    padding: 9,
    borderRadius: 15,
  },
  progressLabel: { fontSize: 10, fontWeight: '600', marginBottom: 10 },
  progressValue: { fontSize: 19, fontWeight: '800' },
  progressGoal: { fontSize: 9, marginVertical: 7 },
  progressTrack: { height: 7, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
});
