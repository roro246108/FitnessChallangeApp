import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import FadeInUp from './FadeInUp';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function RulesCard({ rules }: { rules: string[] }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Challenge Rules</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>A few simple rules to help you succeed.</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.track }]}>
          <Ionicons name="walk" size={26} color={colors.primary} />
        </View>
      </View>

      {rules.map((r, i) => (
        <FadeInUp key={r} delay={i * 70} style={styles.row}>
          <View style={[styles.num, { backgroundColor: colors.track }]}>
            <Text style={[styles.numText, { color: colors.primary }]}>{String(i + 1).padStart(2, '0')}</Text>
          </View>
          <Text style={[styles.rule, { color: colors.text }]}>{r}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </FadeInUp>
      ))}
    </View>
  );
}

const WHY: { icon: IconName; label: string }[] = [
  { icon: 'leaf-outline', label: 'Build healthy habits' },
  { icon: 'flash-outline', label: 'Boost your energy' },
  { icon: 'people-outline', label: 'Join a supportive community' },
  { icon: 'gift-outline', label: 'Earn rewards' },
];

export function WhyJoin() {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: 22 }}>
      <Text style={[styles.title, { color: colors.text, fontSize: 16 }]}>Why Join?</Text>
      <View style={styles.whyRow}>
        {WHY.map((w) => (
          <View key={w.label} style={styles.whyItem}>
            <View style={[styles.whyIcon, { backgroundColor: colors.track }]}>
              <Ionicons name={w.icon} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.whyText, { color: colors.muted }]}>{w.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 18 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 3 },
  badge: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  num: { width: 36, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  numText: { fontSize: 13, fontWeight: '800' },
  rule: { flex: 1, fontSize: 14 },
  whyRow: { flexDirection: 'row', marginTop: 12 },
  whyItem: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  whyIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  whyText: { fontSize: 11, textAlign: 'center', marginTop: 6, lineHeight: 15 },
});