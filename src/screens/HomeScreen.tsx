
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import ActivitySummary from '../components/ActivitySummary';
import ChallengeCard from '../components/ChallengeCard';
import ProgressCard from '../components/ProgressCard';
import type { Colors } from '../theme/Color';
import useHomeViewModel from '../viewmodels/HomeViewModel';

interface HomeScreenProps {
  vm: ReturnType<typeof useHomeViewModel>;
  colors: Colors;
}

export default function HomeScreen({ vm, colors }: HomeScreenProps) {
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        style={vm.darkMode ? 'light' : 'dark'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hello Rawan!
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Keep moving, you&apos;re doing great!
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.card }]}
            onPress={vm.toggleTheme}
          >
            <Text style={{ fontSize: 24 }}>
              {vm.darkMode ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
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
            <TouchableOpacity onPress={() => vm.navigateTo('My Progress')}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            {progressItems.map((item) => (
              <ProgressCard
                key={item.label}
                {...item}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Achievements
            </Text>
            <TouchableOpacity onPress={() => vm.navigateTo('Achievements')}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.achievements}>
            {vm.achievements.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.achievement}
                onPress={() => vm.navigateTo(item.title)}
              >
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        index === 2 || index === 3
                          ? colors.lime
                          : colors.lavender,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.achievementText,
                    { color: colors.text },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { backgroundColor: colors.card },
        ]}
      >
        {[
          { icon: '⌂', title: 'Home' },
          { icon: '⚑', title: 'Challenges' },
          { icon: '＋', title: 'Add' },
          { icon: '▥', title: 'Leaderboard' },
          { icon: '◉', title: 'Profile' },
        ].map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.navItem}
            onPress={() =>
              vm.navigateTo(
                item.title === 'Add' ? 'Record Workout' : item.title
              )
            }
          >
            <Text
              style={[
                styles.navIcon,
                {
                  color:
                    item.title === vm.activeScreen
                      ? colors.primary
                      : colors.muted,
                  fontSize: item.title === 'Add' ? 30 : 24,
                },
              ]}
            >
              {item.icon}
            </Text>
            {item.title !== 'Add' && (
              <Text
                style={[
                  styles.navLabel,
                  {
                    color:
                      item.title === vm.activeScreen
                        ? colors.primary
                        : colors.muted,
                  },
                ]}
              >
                {item.title}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
  themeButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  achievements: { flexDirection: 'row', justifyContent: 'space-between' },
  achievement: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  achievementText: { fontSize: 9, textAlign: 'center', fontWeight: '600' },
  bottomNav: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    paddingVertical: 6,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { lineHeight: 29, fontWeight: '700' },
  navLabel: { fontSize: 9 },
});
