import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface Props {
  streak: number;
  doneToday: boolean;
}

export default function StreakBanner({ streak, doneToday }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.big}>🔥 {doneToday ? streak + 1 : streak} day streak</Text>
        <Text style={styles.sub}>
          {doneToday
            ? "You're locked in for today ✅"
            : 'Upload today\'s proof to keep it. Missing a day resets the streak and costs 25 points.'}
        </Text>
      </View>
      <View style={[styles.pts, { backgroundColor: colors.lime }]}>
        <Text style={styles.ptsText}>+50</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 20, padding: 16, marginTop: 16 },
  big: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4, lineHeight: 17 },
  pts: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  ptsText: { color: '#14112B', fontWeight: '800', fontSize: 14 },
});