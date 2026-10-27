import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';

const INK = '#171326';
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface DayStats {
  steps: number;
  minutes: number;
  goalMet: boolean;
}

// Fake but stable data until a backend exists: the same date always gives the same result.
const dayStats = (y: number, m: number, d: number): DayStats | null => {
  const seed = (y * 372 + m * 31 + d * 7) % 11;
  if (seed < 2) return null; // missed day
  const steps = 3000 + seed * 900;
  return { steps, minutes: 15 + seed * 5, goalMet: steps >= 8000 };
};

export default function ActivityHistory() {
  const { colors } = useTheme();
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const total = new Date(view.y, view.m + 1, 0).getDate();
    const list: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d++) list.push(d);
    return list;
  }, [view]);

  // streak = consecutive days with activity, counted back from today
  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    while (dayStats(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthActive = cells.filter(
    (d) => d && (!isCurrentMonth || d <= today.getDate()) && dayStats(view.y, view.m, d),
  ).length;

  const goMonth = (delta: number) => {
    const next = new Date(view.y, view.m + delta, 1);
    setView({ y: next.getFullYear(), m: next.getMonth() });
    setSelected(null);
  };

  const selStats = selected ? dayStats(view.y, view.m, selected) : null;
  const isFuture = (d: number) => isCurrentMonth && d > today.getDate();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.head}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Activity history</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>
            {monthActive} active days • 🔥 {streak} day streak
          </Text>
        </View>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => goMonth(-1)} style={[styles.navBtn, { backgroundColor: colors.track }]}>
            <Feather name="chevron-left" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goMonth(1)}
            disabled={isCurrentMonth}
            style={[styles.navBtn, { backgroundColor: colors.track, opacity: isCurrentMonth ? 0.4 : 1 }]}
          >
            <Feather name="chevron-right" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.month, { color: colors.text }]}>
        {MONTHS[view.m]} {view.y}
      </Text>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text key={i} style={[styles.weekday, { color: colors.muted }]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (d === null) return <View key={`e${i}`} style={styles.cell} />;
          const stats = isFuture(d) ? null : dayStats(view.y, view.m, d);
          const bg = isFuture(d)
            ? 'transparent'
            : stats?.goalMet
            ? colors.lime
            : stats
            ? colors.lavender
            : colors.track;
          const isToday = isCurrentMonth && d === today.getDate();
          const active = selected === d;
          return (
            <View key={d} style={styles.cell}>
              <TouchableOpacity
                disabled={isFuture(d)}
                onPress={() => setSelected(d)}
                style={[
                  styles.day,
                  { backgroundColor: bg },
                  (isToday || active) && { borderWidth: 2, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: stats?.goalMet ? INK : isFuture(d) ? colors.muted : colors.text,
                  }}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <Legend color={colors.lime} label="Goal met" text={colors.muted} />
        <Legend color={colors.lavender} label="Active" text={colors.muted} />
        <Legend color={colors.track} label="Missed" text={colors.muted} />
      </View>

      {selected && !isFuture(selected) && (
        <View style={[styles.detail, { backgroundColor: colors.background }]}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>
            {MONTHS[view.m]} {selected}
          </Text>
          {selStats ? (
            <View style={styles.detailRow}>
              <Text style={[styles.detailItem, { color: colors.text }]}>👟 {selStats.steps.toLocaleString('en-US')} steps</Text>
              <Text style={[styles.detailItem, { color: colors.text }]}>⏱ {selStats.minutes} min</Text>
              <Text style={[styles.detailItem, { color: selStats.goalMet ? colors.primary : colors.muted }]}>
                {selStats.goalMet ? '✅ Goal met' : 'Goal not met'}
              </Text>
            </View>
          ) : (
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>No activity recorded this day.</Text>
          )}
        </View>
      )}
    </View>
  );
}

function Legend({ color, label, text }: { color: string; label: string; text: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={{ color: text, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 18, marginTop: 14 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 3 },
  nav: { flexDirection: 'row', gap: 8 },
  navBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  month: { fontSize: 14, fontWeight: '800', marginTop: 16, marginBottom: 10 },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekday: { width: '14.28%', textAlign: 'center', fontSize: 11, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', alignItems: 'center', paddingVertical: 3 },
  day: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  detail: { borderRadius: 16, padding: 14, marginTop: 14 },
  detailTitle: { fontSize: 14, fontWeight: '800' },
  detailRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 8 },
  detailItem: { fontSize: 12, fontWeight: '700' },
});