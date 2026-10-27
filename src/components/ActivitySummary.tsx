
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  G,
} from 'react-native-svg';

import type { ActivityData } from '../models/ActivityModel';
import type { Colors } from '../theme/Color';

interface ActivitySummaryProps {
  activity: ActivityData;
  colors: Colors;
}

const RING_SIZE = 140;
const STROKE_WIDTH = 9;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ActivitySummary({
  activity,
  colors,
}: ActivitySummaryProps) {
  const progress =
    activity.stepsGoal > 0
      ? Math.min(1, Math.max(0, activity.steps / activity.stepsGoal))
      : 0;

  const progressLength = CIRCUMFERENCE * progress;
  const remainingLength = CIRCUMFERENCE - progressLength;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
      ]}
    >
      {/* Card Heading */}
      <View style={styles.headingRow}>
        <Text style={styles.headingIcon}>▦</Text>

        <Text style={[styles.heading, { color: colors.text }]}>
          Today's Activity
        </Text>
      </View>

      <View style={styles.content}>
        {/* Circular Steps Progress */}
        <View style={styles.ringContainer}>
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          >
            <G rotation="-90" origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}>
              {/* Background ring */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={colors.track}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />

              {/* Progress ring */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={colors.primary}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={`${progressLength} ${remainingLength}`}
                fill="none"
              />

             
            </G>
          </Svg>

          {/* Centered Step Count */}
          <View style={styles.ringCenter}>
            <Text
              style={[
                styles.steps,
                { color: colors.text },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {activity.steps.toLocaleString()}
            </Text>

            <Text style={[styles.stepsLabel, { color: colors.muted }]}>
              steps
            </Text>
          </View>
        </View>

        {/* Activity Statistics */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>

            <View style={styles.statText}>
              <Text style={[styles.number, { color: colors.text }]}>
                {activity.calories}
              </Text>

              <Text style={[styles.label, { color: colors.muted }]}>
                calories
              </Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statIcon, { color: colors.lavender }]}>
              ◷
            </Text>

            <View style={styles.statText}>
              <Text style={[styles.number, { color: colors.text }]}>
                {activity.workoutMinutes}
              </Text>

              <Text style={[styles.label, { color: colors.muted }]}>
                workout mins
              </Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.streakIcon}>⚡</Text>

            <View style={styles.statText}>
              <Text style={[styles.number, { color: colors.text }]}>
                {activity.streak}
              </Text>

              <Text style={[styles.label, { color: colors.muted }]}>
                day streak
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Daily Goal Progress */}
      <View style={styles.goalSection}>
        <View style={styles.goalHeader}>
          <Text style={[styles.goalText, { color: colors.muted }]}>
            Daily step goal
          </Text>

          <Text style={[styles.goalPercent, { color: colors.lime }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>

        <View
          style={[
            styles.goalTrack,
            { backgroundColor: colors.track },
          ]}
        >
          <View
            style={[
              styles.goalFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: colors.lime,
              },
            ]}
          />
        </View>

        <Text style={[styles.goalCaption, { color: colors.muted }]}>
          {activity.steps.toLocaleString()} of{' '}
          {activity.stepsGoal.toLocaleString()} steps
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 17,
    marginBottom: 16,
  },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 17,
  },

  headingIcon: {
    fontSize: 19,
    color: '#A38DF2',
  },

  heading: {
    fontSize: 16,
    fontWeight: '800',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  steps: {
    fontSize: 23,
    fontWeight: '900',
  },

  stepsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },

  stats: {
    flex: 1,
    gap: 15,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  statIcon: {
    width: 23,
    fontSize: 19,
    textAlign: 'center',
  },

  streakIcon: {
    width: 23,
    fontSize: 20,
    textAlign: 'center',
  },

  statText: {
    flex: 1,
  },

  number: {
    fontSize: 18,
    fontWeight: '800',
  },

  label: {
    fontSize: 12,
    marginTop: 2,
  },

  goalSection: {
    marginTop: 20,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  goalText: {
    fontSize: 11,
    fontWeight: '600',
  },

  goalPercent: {
    fontSize: 12,
    fontWeight: '800',
  },

  goalTrack: {
    height: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },

  goalFill: {
    height: '100%',
    borderRadius: 5,
  },

  goalCaption: {
    fontSize: 10,
    marginTop: 7,
  },
});
