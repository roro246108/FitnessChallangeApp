import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polygon, Line } from 'react-native-svg';
import { useTheme } from '../theme/useTheme';
import { NATIVE } from '../theme/motion';

const INK = '#171326';

function Unit({ value, unit }: { value: number; unit: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.number}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.unitLabel}>{unit}</Text>
    </View>
  );
}

function Mountain({ color }: { color: string }) {
  return (
    <Svg width={130} height={80} viewBox="0 0 140 80">
      <Polygon points="0,80 38,38 72,80" fill={color} opacity={0.25} />
      <Polygon points="100,80 122,50 140,80" fill={color} opacity={0.25} />
      <Polygon points="28,80 80,20 132,80" fill={color} opacity={0.4} />
      <Polygon points="80,20 66,36 76,33 82,40 90,33 96,36" fill="#FFFFFF" opacity={0.7} />
      <Line x1="80" y1="20" x2="80" y2="4" stroke={color} strokeWidth={2} />
      <Polygon points="80,4 94,9 80,14" fill={color} />
    </Svg>
  );
}

interface Props {
  days: number;
  hours: number;
  minutes: number;
  elapsedDays: number;
  durationDays: number;
}

export default function CountdownBlock({ days, hours, minutes, elapsedDays, durationDays }: Props) {
  const { colors } = useTheme();
  const pct = Math.min(elapsedDays / durationDays, 1);

  const message =
    pct >= 1
      ? 'Challenge finished!'
      : pct >= 0.75
      ? 'Final stretch!'
      : pct >= 0.4
      ? "You're halfway there!"
      : 'Great start, keep going!';

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: NATIVE }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: NATIVE }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, [pulse]);
  const sparkleScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.2] });
  const sparkleOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <View style={[styles.wrap, { backgroundColor: colors.lavender }]}>
      <View style={styles.mountain} pointerEvents="none">
        <Mountain color={colors.primary} />
      </View>

      <View style={styles.headRow}>
        <Ionicons name="timer-outline" size={18} color={INK} />
        <Text style={styles.heading}>Challenge ends in</Text>
      </View>

      <View style={styles.row}>
        <Unit value={days} unit="days" />
        <Text style={styles.sep}>:</Text>
        <Unit value={hours} unit="hours" />
        <Text style={styles.sep}>:</Text>
        <Unit value={minutes} unit="minutes" />
      </View>

      <View style={styles.msg}>
        <Animated.View style={{ opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
        </Animated.View>
        <Text style={[styles.msgText, { color: colors.primary }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 24, padding: 18, overflow: 'hidden', minHeight: 120 },
  mountain: { position: 'absolute', right: 6, bottom: 0 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heading: { color: INK, fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  unit: { alignItems: 'center' },
  number: { color: INK, fontSize: 32, fontWeight: '800', lineHeight: 38 },
  unitLabel: { color: INK, opacity: 0.65, fontSize: 11 },
  sep: { color: INK, fontSize: 28, fontWeight: '800', lineHeight: 36, marginHorizontal: 8 },
  msg: {
    position: 'absolute',
    right: 14,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: 130,
  },
  msgText: { fontSize: 12, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
});