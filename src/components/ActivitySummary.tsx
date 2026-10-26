
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ActivityData } from '../models/ActivityModel';
import type { Colors } from '../theme/Color';

interface ActivitySummaryProps {
  activity: ActivityData;
  colors: Colors;
}

export default function ActivitySummary({
  activity,
  colors,
}: ActivitySummaryProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        ▦  Today&apos;s Activity
      </Text>

      <View style={styles.content}>
        <View style={[styles.ring, { borderColor: colors.primary }]}>
          <View style={styles.ringAccent} />
          <Text style={[styles.steps, { color: colors.text }]}>
            {activity.steps.toLocaleString()}
          </Text>
          <Text style={{ color: colors.muted }}>steps</Text>
        </View>

        <View style={styles.stats}>
          <Text style={[styles.number, { color: colors.text }]}>
            🔥  {activity.calories}
          </Text>
          <Text style={{ color: colors.muted }}>      calories</Text>

          <Text style={[styles.number, { color: colors.text }]}>
            ◷  {activity.workoutMinutes}
          </Text>
          <Text style={{ color: colors.muted }}>      workout mins</Text>

          <Text style={[styles.number, { color: colors.text }]}>
            ⚡  {activity.streak}
          </Text>
          <Text style={{ color: colors.muted }}>      day streak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 17,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ring: {
    width: 130,
    height: 130,
    borderWidth: 8,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringAccent: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 30,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CDFF7E',
    transform: [{ rotate: '25deg' }],
  },
  steps: {
    fontSize: 23,
    fontWeight: '800',
  },
  stats: {
    flex: 1,
    marginLeft: 15,
  },
  number: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
  },
});
