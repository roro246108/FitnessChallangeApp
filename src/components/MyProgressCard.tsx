import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const INK = '#171326';
const SIZE = 92;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

interface Props {
  durationDays: number;
  elapsedDays: number;
  reward: string;
  done: number[];
  onToggle: (day: number) => void;
}

export default function MyProgressCard({ durationDays, elapsedDays, reward, done, onToggle }: Props) {
  const { colors } = useTheme();
  const total = Math.min(durationDays, 30);
  const today = Math.min(Math.max(elapsedDays, 1), total);
  const count = done.length;
  const pct = Math.round((count / total) * 100);
  const finished = count >= total;

  // animate the ring (strokeDashoffset isn't supported by the native driver)
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: pct / 100, duration: 700, useNativeDriver: false }).start();
  }, [pct, progress]);
  const offset = progress.interpolate({ inputRange: [0, 1], outputRange: [CIRC, 0] });

  const days = Array.from({ length: Math.min(total, 10) }, (_, i) => i + 1);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.top}>
        <View style={styles.ringWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.track} strokeWidth={STROKE} fill="none" />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={finished ? colors.lime : colors.primary}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${CIRC}`}
              strokeDashoffset={offset}
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.pct, { color: colors.text }]}>{pct}%</Text>
            <Text style={[styles.pctLabel, { color: colors.muted }]}>Completed</Text>
          </View>
        </View>

        <View style={styles.mid}>
          <Text style={[styles.title, { color: colors.text }]}>My Progress</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>
            {count} / {total} days
          </Text>
          <Text style={[styles.sub, { color: colors.muted }]}>Day {today} today</Text>
        </View>

        <View style={[styles.reward, { backgroundColor: colors.track }]}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
          <Text style={[styles.rewardLabel, { color: colors.muted }]}>Reward</Text>
          <Text style={[styles.rewardValue, { color: colors.primary }]} numberOfLines={1}>
            {reward}
          </Text>
        </View>
      </View>

      <View style={styles.dots}>
        {days.map((d) => {
          const isDone = done.includes(d);
          const isToday = d === today;
          const future = d > today;
          return (
            <TouchableOpacity
              key={d}
              disabled={future}
              onPress={() => onToggle(d)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              style={[
                styles.dot,
                { backgroundColor: isDone ? colors.primary : 'transparent', borderColor: isDone ? colors.primary : colors.track },
                isToday && !isDone && { borderColor: colors.primary },
                future && { opacity: 0.4 },
              ]}
            >
              {isDone ? (
                <Feather name="check" size={14} color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>{d}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {finished && (
        <View style={[styles.done, { backgroundColor: colors.lime }]}>
          <Text style={styles.doneText}>🏆 Challenge completed! You earned {reward}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 16, marginTop: 18 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  ringWrap: { width: SIZE, height: SIZE },
  ringCenter: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },  pct: { fontSize: 20, fontWeight: '800' },
  pctLabel: { fontSize: 10, marginTop: 1 },
  mid: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 4 },
  reward: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', minWidth: 84 },
  rewardLabel: { fontSize: 11, marginTop: 4 },
  rewardValue: { fontSize: 14, fontWeight: '800', marginTop: 1 },
  dots: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  dot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  done: { borderRadius: 16, padding: 12, marginTop: 14 },
  doneText: { color: INK, fontWeight: '800', fontSize: 13, textAlign: 'center' },
});