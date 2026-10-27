import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import type { Colors } from '../theme/Color';
import ProgressRing from '../components/ProgressRing';
import ActivityHistory from '../components/ActivityHistory';
import ConfirmSheet from '../components/ConfirmSheet';
import CelebrationModal from '../components/CelebrationModal';
import GoalItem from '../components/GoalItem';
import NewGoalModal from '../components/NewGoalModal';
import { INK } from '../data/goalMeta';
import useMyGoalsViewModel, {
  GOAL_FILTERS,
  GOAL_RANGES,
  STREAK,
  type Goal,
} from '../viewmodels/useMyGoalsViewModel';

interface Props {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export default function GoalsScreen({ onBack, onNavigate }: Props) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const vm = useMyGoalsViewModel();
  const [pendingDelete, setPendingDelete] = useState<Goal | null>(null);
  const { data } = vm;

  const maxBar = Math.max(...data.chart.values, data.chart.goalLine);
  const CHART_H = 120;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: colors.track }]}
            onPress={onBack}
            accessibilityLabel="Back to home"
          >
            <Feather name="chevron-left" size={22} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>My Goals</Text>
            <Text style={styles.headerSub}>Track it. Hit it. Repeat.</Text>
          </View>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: colors.primary }]}
            onPress={vm.openForm}
            accessibilityLabel="Set new goal"
          >
            <Feather name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Day / Week / Month */}
        <View style={styles.segment}>
          {GOAL_RANGES.map((r) => {
            const active = r === vm.range;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.segmentItem, active && { backgroundColor: colors.primary }]}
                onPress={() => vm.setRange(r)}
              >
                <Text style={[styles.segmentText, { color: active ? '#FFFFFF' : colors.muted }]}>
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Steps summary */}
        <View style={styles.stepsCard}>
          <ProgressRing percent={vm.percent} />
          <View style={styles.stepsInfo}>
            <Text style={styles.muted}>{data.periodLabel}</Text>
            <Text style={styles.stepsBig}>{data.steps.current.toLocaleString('en-US')}</Text>
            <Text style={styles.mutedSmall}>of {data.steps.goal.toLocaleString('en-US')} steps</Text>
            <View style={[styles.changePill, { backgroundColor: colors.lime }]}>
              <Text style={styles.changeText}>
                ▲ {data.change}% {data.compareLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Stat tiles */}
        <View style={styles.statsRow}>
          {data.stats.map((s) => (
            <View key={s.label} style={styles.statTile}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Activity</Text>
            <Text style={styles.mutedSmall}>{data.chart.unitLabel}</Text>
          </View>

          <View style={[styles.chart, { height: CHART_H }]}>
            <View
              style={[
                styles.goalLine,
                { bottom: (data.chart.goalLine / maxBar) * CHART_H, borderColor: colors.lime },
              ]}
            />
            {data.chart.values.map((v, i) => {
              const reached = v >= data.chart.goalLine;
              return (
                <View key={data.chart.labels[i]} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max((v / maxBar) * CHART_H, 4),
                        backgroundColor: reached ? colors.lime : colors.primary,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.chartLabels}>
            {data.chart.labels.map((l) => (
              <Text key={l} style={[styles.barLabel, { color: colors.muted }]}>
                {l}
              </Text>
            ))}
          </View>
          <Text style={[styles.mutedSmall, { marginTop: 10 }]}>
            Green bars = goal reached (line shows the target)
          </Text>
        </View>

        {/* Streak */}
        <View style={[styles.streakCard, { backgroundColor: colors.primary }]}>
          <View style={styles.streakTop}>
            <View>
              <Text style={styles.streakBig}>🔥 {STREAK.days} day streak</Text>
              <Text style={styles.streakSub}>Best streak: {STREAK.best} days</Text>
            </View>
          </View>
          <View style={styles.streakDots}>
            {STREAK.last7.map((done, i) => (
              <View key={i} style={styles.dotCol}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: done ? colors.lime : 'rgba(255,255,255,0.25)' },
                  ]}
                >
                  {done && <Feather name="check" size={14} color={INK} />}
                </View>
                <Text style={styles.dotLabel}>{STREAK.dayLabels[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity history (calendar) */}
        <ActivityHistory />

        {/* Goals header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {vm.range === 'Day' ? "Today's" : vm.range === 'Week' ? "This week's" : "This month's"} goals
          </Text>
          <Text style={[styles.countText, { color: colors.primary }]}>
            {vm.completedCount}/{vm.rangeGoalsCount} done
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {GOAL_FILTERS.map((f) => {
            const active = f === vm.filter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => vm.setFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: colors.track,
                  },
                ]}
              >
                <Text style={{ color: active ? '#FFFFFF' : colors.text, fontWeight: '600', fontSize: 12 }}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Goals list */}
        {vm.visibleGoals.length > 0 ? (
          vm.visibleGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              colors={colors}
              onAdd={() => vm.addProgress(goal.id)}
              onToggle={() => vm.toggleComplete(goal.id)}
              onEdit={() => vm.openEdit(goal)}
              onDelete={() => setPendingDelete(goal)}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals here yet</Text>
            <Text style={styles.mutedSmall}>Tap “Set new goal” to add one.</Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={vm.openForm}>
          <Text style={styles.ctaText}>Set new goal</Text>
          <Feather name="arrow-right" size={18} color={INK} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card, borderColor: colors.track }]}>
        <NavItem icon="⌂" label="Home" color={colors.muted} onPress={onBack} />
        <NavItem icon="⚑" label="Challenges" color={colors.muted} onPress={() => onNavigate?.('Challenges')} />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => onNavigate?.('Record Workout')}
          accessibilityLabel="Record workout"
        >
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
        <NavItem icon="▥" label="Leaderboard" color={colors.muted} onPress={() => onNavigate?.('Leaderboard')} />
        <NavItem icon="◉" label="Profile" color={colors.muted} onPress={() => onNavigate?.('Profile')} />
      </View>

      <NewGoalModal
        visible={vm.formVisible}
        editing={vm.editing}
        colors={colors}
        defaultPeriod={vm.range}
        onClose={vm.closeForm}
        onSave={(input) => {
          vm.saveGoal(input);
          vm.closeForm();
        }}
      />

      <ConfirmSheet
        visible={!!pendingDelete}
        title="Delete this goal?"
        message={`“${pendingDelete?.title ?? ''}” and its progress will be removed.`}
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) vm.deleteGoal(pendingDelete.id);
          setPendingDelete(null);
        }}
      />

      <CelebrationModal goal={vm.celebrate} onClose={vm.dismissCelebrate} />
    </SafeAreaView>
  );
}

function NavItem({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={navStyles.item} onPress={onPress}>
      <Text style={[navStyles.icon, { color }]}>{icon}</Text>
      <Text style={[navStyles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const navStyles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 23, lineHeight: 28, fontWeight: '700' },
  label: { fontSize: 9 },
});

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    content: { padding: 20, paddingBottom: 24 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    headerCenter: { alignItems: 'center' },
    headerTitle: { fontSize: 19, fontWeight: '800', color: c.text },
    headerSub: { fontSize: 11, color: c.muted, marginTop: 2 },
    circleBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    segment: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 16, padding: 4, borderWidth: 1, borderColor: c.track },
    segmentItem: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    segmentText: { fontSize: 13, fontWeight: '700' },
    stepsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 18,
      marginTop: 16,
    },
    stepsInfo: { marginLeft: 20, flex: 1 },
    muted: { fontSize: 13, color: c.muted },
    mutedSmall: { fontSize: 12, color: c.muted },
    stepsBig: { fontSize: 30, fontWeight: '800', color: c.text, marginVertical: 2 },
    changePill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginTop: 8 },
    changeText: { fontSize: 11, fontWeight: '800', color: INK },
    statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
    statTile: { flex: 1, backgroundColor: c.card, borderRadius: 20, paddingVertical: 14, alignItems: 'center' },
    statIcon: { fontSize: 20, marginBottom: 6 },
    statValue: { fontSize: 16, fontWeight: '800', color: c.text },
    statLabel: { fontSize: 11, color: c.muted, marginTop: 2 },
    card: { backgroundColor: c.card, borderRadius: 24, padding: 18, marginTop: 14 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: c.text },
    chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
    goalLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed' },
    barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
    bar: { width: '60%', borderRadius: 8 },
    chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 8 },
    barLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600' },
    streakCard: { borderRadius: 24, padding: 18, marginTop: 14 },
    streakTop: { flexDirection: 'row', justifyContent: 'space-between' },
    streakBig: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
    streakSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },
    streakDots: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    dotCol: { alignItems: 'center', gap: 6 },
    dot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    dotLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: c.text },
    countText: { fontSize: 12, fontWeight: '800' },
    filters: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, borderWidth: 1 },
    empty: { alignItems: 'center', backgroundColor: c.card, borderRadius: 20, padding: 28 },
    emptyTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 10, marginBottom: 4 },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.lime,
      borderRadius: 18,
      paddingVertical: 16,
      marginTop: 6,
    },
    ctaText: { fontSize: 15, fontWeight: '800', color: INK },
    bottomNav: {
      minHeight: 62,
      borderTopWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    addButton: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3 },
    addText: { color: '#FFFFFF', fontSize: 30, lineHeight: 35 },
  });