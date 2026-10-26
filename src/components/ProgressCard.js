
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressCard({
  icon,
  label,
  value,
  goal,
  progress,
  color,
  colors,
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.label, { color: colors.text }]}>
        {icon} {label}
      </Text>

      <Text style={[styles.value, { color: colors.text }]}>
        {value.toLocaleString()}
      </Text>

      <Text style={[styles.goal, { color: colors.muted }]}>
        / {goal}
      </Text>

      <View style={[styles.track, { backgroundColor: colors.track }]}>
        <View
          style={[
            styles.fill,
            { width: `${progress}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    padding: 9,
    borderRadius: 15,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 10,
  },
  value: {
    fontSize: 19,
    fontWeight: '800',
  },
  goal: {
    fontSize: 9,
    marginVertical: 7,
  },
  track: {
    height: 7,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
