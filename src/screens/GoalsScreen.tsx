
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';
import type { Colors } from '../theme/Color';

import ProgressRing from '../components/ProgressRing';
import ActivityHistory from '../components/ActivityHistory';
import ConfirmSheet from '../components/ConfirmSheet';
import CelebrationModal from '../components/CelebrationModal';
import GoalItem from '../components/GoalItem';
import NewGoalModal from '../components/NewGoalModal';

import { INK, CATEGORY_IMAGE } from '../data/goalMeta';

import useMyGoalsViewModel, {
  GOAL_FILTERS,
  GOAL_RANGES,
  STREAK,
  type Goal,
} from '../viewmodels/useMyGoalsViewModel';

interface Props {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function GoalsScreen({ onBack, onNavigate }: Props) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const vm = useMyGoalsViewModel();

  const [pendingDelete, setPendingDelete] = useState<Goal | null>(null);

  const { data } = vm;

  const maxBar = Math.max(...data.chart.values, data.chart.goalLine);
  const CHART_H = 120;

  const completionPercentage =
    vm.rangeGoalsCount > 0
      ? Math.round(
          (vm.completedCount / vm.rangeGoalsCount) * 100,
        )
      : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BrandHeader />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: colors.track }]}
            onPress={onBack}
            accessibilityLabel="Back to home"
          >
            <Feather
              name="chevron-left"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>My Goals</Text>
            <Text style={styles.headerSub}>
              Track it. Hit it. Repeat.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.circleBtn,
              { backgroundColor: colors.primary },
            ]}
            onPress={vm.openForm}
            accessibilityLabel="Set new goal"
          >
            <Feather name="plus" size={25} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Day / Week / Month */}
        <View style={styles.segment}>
          {GOAL_RANGES.map((range) => {
            const active = range === vm.range;

            return (
              <TouchableOpacity
                key={range}
                style={[
                  styles.segmentItem,
                  active && { backgroundColor: colors.primary },
                ]}
                onPress={() => vm.setRange(range)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: active ? '#FFFFFF' : colors.muted,
                    },
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Steps summary */}
        <View
          style={[
            styles.stepsCard,
            { backgroundColor: colors.card },
          ]}
        >
          <ProgressRing percent={vm.percent} />

          <View style={styles.stepsInfo}>
            <Text style={styles.muted}>{data.periodLabel}</Text>

            <Text style={styles.stepsBig}>
              {data.steps.current.toLocaleString('en-US')}
            </Text>

            <Text style={styles.mutedSmall}>
              of {data.steps.goal.toLocaleString('en-US')} steps
            </Text>

            <View
              style={[
                styles.changePill,
                { backgroundColor: colors.lime },
              ]}
            >
              <Text style={styles.changeText}>
                ▲ {data.change}% {data.compareLabel}
              </Text>
            </View>
          </View>

          {/* Realistic running shoe image */}
          <Image
            source={{ uri: CATEGORY_IMAGE.Steps }}
            style={styles.stepsHeroImage}
            resizeMode="cover"
            accessibilityLabel="Running shoes"
          />

          <View style={styles.stepsRemainingBadge}>
            <Feather
              name="target"
              size={20}
              color="#FFFFFF"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.remainingBig}>
                {Math.max(data.steps.goal - data.steps.current, 0)
                  .toLocaleString('en-US')}
              </Text>
              <Text style={styles.remainingLabel}>steps to go</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsRow}>
          {data.stats.map((stat) => (
            <View key={stat.label} style={styles.statTile}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Activity chart */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Activity</Text>
            <Text style={styles.mutedSmall}>
              {data.chart.unitLabel}
            </Text>
          </View>

          <View style={[styles.chart, { height: CHART_H }]}>
            {/* Goal target line */}
            <View
              style={[
                styles.goalLine,
                {
                  bottom:
                    (data.chart.goalLine / maxBar) * CHART_H,
                  borderColor: colors.lime,
                },
              ]}
            />

            {data.chart.values.map((value, index) => {
              const reached = value >= data.chart.goalLine;

              return (
                <View
                  key={data.chart.labels[index]}
                  style={styles.barCol}
                >
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(
                          (value / maxBar) * CHART_H,
                          4,
                        ),
                        backgroundColor: reached
                          ? colors.lime
                          : colors.primary,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.chartLabels}>
            {data.chart.labels.map((label) => (
              <Text
                key={label}
                style={[
                  styles.barLabel,
                  { color: colors.muted },
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.lime },
                ]}
              />
              <Text style={styles.mutedSmall}>Goal reached</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text style={styles.mutedSmall}>Below goal</Text>
            </View>
          </View>
        </View>

        {/* Streak */}
        <View
          style={[
            styles.streakCard,
            { backgroundColor: colors.primary },
          ]}
        >
          <View style={styles.streakTop}>
            <View style={styles.streakHeading}>
              <Text style={styles.streakEmoji}>🔥</Text>

              <View>
                <Text style={styles.streakBig}>
                  {STREAK.days} day streak
                </Text>
                <Text style={styles.streakSub}>
                  Best streak: {STREAK.best} days
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => onNavigate?.('Activity History')}
              activeOpacity={0.8}
            >
              <Feather
                name="calendar"
                size={15}
                color="#FFFFFF"
              />
              <Text style={styles.calendarButtonText}>
                View calendar
              </Text>
              <Feather
                name="chevron-right"
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.streakDots}>
            {STREAK.last7.map((done, index) => (
              <View key={index} style={styles.dotCol}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: done
                        ? colors.lime
                        : 'rgba(255,255,255,0.25)',
                    },
                  ]}
                >
                  {done && (
                    <Feather
                      name="check"
                      size={15}
                      color={INK}
                    />
                  )}
                </View>

                <Text style={styles.dotLabel}>
                  {STREAK.dayLabels[index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Existing activity history calendar */}
        <ActivityHistory />

        {/* Today's goals header */}
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {vm.range === 'Day'
                ? "Today's goals"
                : vm.range === 'Week'
                  ? "This week's goals"
                  : "This month's goals"}
            </Text>

            <Text style={styles.sectionSubtitle}>
              Keep moving. You're doing great!
            </Text>
          </View>

          <View
            style={[
              styles.completionBadge,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.completionNumber,
                { color: colors.lime },
              ]}
            >
              {vm.completedCount}/{vm.rangeGoalsCount}
            </Text>
            <Text style={styles.completionLabel}>Completed</Text>
          </View>
        </View>

        {/* Goal filters */}
        <View style={styles.filters}>
          {GOAL_FILTERS.map((filter) => {
            const active = filter === vm.filter;

            const label =
              filter === 'Done' ? 'Completed' : filter;

            return (
              <TouchableOpacity
                key={filter}
                onPress={() => vm.setFilter(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? colors.primary
                      : colors.card,
                    borderColor: colors.track,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={{
                    color: active ? '#FFFFFF' : colors.text,
                    fontWeight: '700',
                    fontSize: 12,
                  }}
                >
                  {label}
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
          <View
            style={[
              styles.empty,
              { backgroundColor: colors.card },
            ]}
          >
            <Feather
              name="target"
              size={36}
              color={colors.lavender}
            />

            <Text style={styles.emptyTitle}>
              No goals here yet
            </Text>

            <Text style={styles.mutedSmall}>
              Tap “Set new goal” to add one.
            </Text>
          </View>
        )}

        {/* Goal progress overview */}
        <View
          style={[
            styles.insightsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.track,
            },
          ]}
        >
          <View style={styles.insightsHeader}>
            <View
              style={[
                styles.insightsIcon,
                { backgroundColor: colors.background },
              ]}
            >
              <Feather
                name="trending-up"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.insightsTitle}>
                {vm.range === 'Day'
                  ? "Today's overview"
                  : vm.range === 'Week'
                    ? 'Weekly goal insights'
                    : 'Monthly overview'}
              </Text>

              <Text style={styles.mutedSmall}>
                Your progress for this period
              </Text>
            </View>
          </View>

          <View style={styles.insightsStats}>
            <View style={styles.insightStat}>
              <Text
                style={[
                  styles.insightValue,
                  { color: colors.lime },
                ]}
              >
                {vm.completedCount}
              </Text>
              <Text style={styles.mutedSmall}>Completed</Text>
            </View>

            <View
              style={[
                styles.insightDivider,
                { backgroundColor: colors.track },
              ]}
            />

            <View style={styles.insightStat}>
              <Text
                style={[
                  styles.insightValue,
                  { color: colors.primary },
                ]}
              >
                {Math.max(
                  vm.rangeGoalsCount - vm.completedCount,
                  0,
                )}
              </Text>
              <Text style={styles.mutedSmall}>Remaining</Text>
            </View>

            <View
              style={[
                styles.insightDivider,
                { backgroundColor: colors.track },
              ]}
            />

            <View style={styles.insightStat}>
              <Text
                style={[
                  styles.insightValue,
                  { color: colors.text },
                ]}
              >
                {completionPercentage}%
              </Text>
              <Text style={styles.mutedSmall}>Completion</Text>
            </View>
          </View>

          <View
            style={[
              styles.insightTrack,
              { backgroundColor: colors.track },
            ]}
          >
            <View
              style={[
                styles.insightFill,
                {
                  width: `${completionPercentage}%`,
                  backgroundColor: colors.lime,
                },
              ]}
            />
          </View>
        </View>

        {/* Set new goal */}
        <TouchableOpacity
          style={[
            styles.cta,
            { backgroundColor: colors.lime },
          ]}
          activeOpacity={0.85}
          onPress={vm.openForm}
        >
          <Feather
            name="plus"
            size={20}
            color={INK}
          />
          <Text style={styles.ctaText}>Set new goal</Text>
          <Feather
            name="arrow-right"
            size={18}
            color={INK}
          />
        </TouchableOpacity>
      </ScrollView>

      <BottomNav
        colors={colors}
        activeScreen="My Goals"
        onNavigate={onNavigate}
      />

      {/* New / Edit goal modal */}
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

      {/* Delete confirmation */}
      <ConfirmSheet
        visible={!!pendingDelete}
        title="Delete this goal?"
        message={`"${pendingDelete?.title ?? ''}" and its progress will be removed.`}
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            vm.deleteGoal(pendingDelete.id);
          }
          setPendingDelete(null);
        }}
      />

      {/* Goal completion celebration */}
      <CelebrationModal
        goal={vm.celebrate}
        onClose={vm.dismissCelebrate}
      />
    </SafeAreaView>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    headerCenter: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 21,
      fontWeight: '900',
      color: c.text,
    },
    headerSub: {
      fontSize: 12,
      color: c.muted,
      marginTop: 3,
    },
    circleBtn: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segment: {
      flexDirection: 'row',
      backgroundColor: c.card,
      borderRadius: 18,
      padding: 4,
      borderWidth: 1,
      borderColor: c.track,
    },
    segmentItem: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 13,
      alignItems: 'center',
    },
    segmentText: {
      fontSize: 14,
      fontWeight: '700',
    },
    stepsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 16,
      paddingRight: 84,
      marginTop: 18,
      minHeight: 164,
      position: 'relative',
      overflow: 'hidden',
    },
    stepsInfo: {
      marginLeft: 16,
      flex: 1,
      zIndex: 1,
    },
    stepsHeroImage: {
      position: 'absolute',
      right: 5,
      top: 12,
      width: 82,
      height: 82,
      borderRadius: 16,
      opacity: 0.95,
    },
    stepsRemainingBadge: {
      position: 'absolute',
      right: 10,
      bottom: 12,
      width: 132,
      minHeight: 46,
      paddingHorizontal: 9,
      paddingVertical: 7,
      borderRadius: 14,
      backgroundColor: c.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    remainingBig: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    remainingLabel: {
      color: '#FFFFFF',
      fontSize: 10,
    },
    muted: {
      fontSize: 13,
      color: c.muted,
    },
    mutedSmall: {
      fontSize: 12,
      color: c.muted,
    },
    stepsBig: {
      fontSize: 30,
      fontWeight: '900',
      color: c.text,
      marginVertical: 2,
    },
    changePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 11,
      marginTop: 8,
    },
    changeText: {
      fontSize: 11,
      fontWeight: '800',
      color: INK,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
    statTile: {
      flex: 1,
      backgroundColor: c.card,
      borderRadius: 19,
      paddingVertical: 15,
      alignItems: 'center',
    },
    statIcon: {
      fontSize: 21,
      marginBottom: 6,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '800',
      color: c.text,
    },
    statLabel: {
      fontSize: 11,
      color: c.muted,
      marginTop: 3,
      textAlign: 'center',
    },
    card: {
      backgroundColor: c.card,
      borderRadius: 24,
      padding: 18,
      marginTop: 16,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: c.text,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8,
    },
    goalLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderTopWidth: 1.5,
      borderStyle: 'dashed',
    },
    barCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    bar: {
      width: '60%',
      borderRadius: 8,
    },
    chartLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      gap: 8,
    },
    barLabel: {
      flex: 1,
      textAlign: 'center',
      fontSize: 11,
      fontWeight: '600',
    },
    chartLegend: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
      marginTop: 13,
      flexWrap: 'wrap',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    streakCard: {
      borderRadius: 24,
      padding: 18,
      marginTop: 16,
    },
    streakTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    streakHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    streakEmoji: {
      fontSize: 28,
    },
    streakBig: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '900',
    },
    streakSub: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
      marginTop: 4,
    },
    calendarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    calendarButtonText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '600',
    },
    streakDots: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 18,
    },
    dotCol: {
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotLabel: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 11,
      fontWeight: '700',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 25,
      marginBottom: 13,
      gap: 10,
    },
    sectionTitle: {
      fontSize: 19,
      fontWeight: '900',
      color: c.text,
    },
    sectionSubtitle: {
      fontSize: 11,
      color: c.muted,
      marginTop: 5,
    },
    completionBadge: {
      borderWidth: 1,
      borderRadius: 15,
      paddingHorizontal: 13,
      paddingVertical: 9,
      alignItems: 'center',
      minWidth: 84,
    },
    completionNumber: {
      fontSize: 19,
      fontWeight: '900',
    },
    completionLabel: {
      fontSize: 10,
      color: c.muted,
      marginTop: 2,
    },
    filters: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },
    filterChip: {
      paddingHorizontal: 17,
      paddingVertical: 10,
      borderRadius: 15,
      borderWidth: 1,
    },
    empty: {
      alignItems: 'center',
      borderRadius: 20,
      padding: 28,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: c.text,
      marginTop: 10,
      marginBottom: 4,
    },
    insightsCard: {
      borderRadius: 22,
      borderWidth: 1,
      padding: 16,
      marginTop: 8,
      marginBottom: 15,
    },
    insightsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    insightsIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    insightsTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: c.text,
      marginBottom: 4,
    },
    insightsStats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: 19,
    },
    insightStat: {
      flex: 1,
      alignItems: 'center',
      gap: 5,
    },
    insightValue: {
      fontSize: 23,
      fontWeight: '900',
    },
    insightDivider: {
      width: 1,
      height: 36,
    },
    insightTrack: {
      height: 7,
      borderRadius: 5,
      overflow: 'hidden',
      marginTop: 17,
    },
    insightFill: {
      height: '100%',
      borderRadius: 5,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 18,
      paddingVertical: 16,
      marginTop: 3,
      marginBottom: 8,
    },
    ctaText: {
      fontSize: 15,
      fontWeight: '900',
      color: INK,
    },
  });
