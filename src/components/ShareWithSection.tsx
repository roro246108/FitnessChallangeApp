import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';

export type Visibility = 'community' | 'private';

interface Props {
  value: Visibility;
  onChange: (v: Visibility) => void;
  challengeTitle: string;
}

const OPTIONS: { key: Visibility; icon: 'people' | 'lock-closed'; title: string; hint: string }[] = [
  { key: 'community', icon: 'people', title: 'Challenge community', hint: 'Everyone in this challenge can see it, react and comment' },
  { key: 'private', icon: 'lock-closed', title: 'Only me', hint: 'Counts as proof, but nobody else sees it' },
];

export default function ShareWithSection({ value, onChange, challengeTitle }: Props) {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>Share with</Text>
      <Text style={[styles.sub, { color: colors.muted }]} numberOfLines={1}>
        Challenge: {challengeTitle}
      </Text>

      {OPTIONS.map((o) => {
        const active = value === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            activeOpacity={0.85}
            onPress={() => onChange(o.key)}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: active ? colors.primary : colors.track,
                borderWidth: active ? 2 : 1,
              },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: active ? colors.primary : colors.track }]}>
              <Ionicons name={o.icon} size={20} color={active ? '#FFFFFF' : colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{o.title}</Text>
              <Text style={[styles.hint, { color: colors.muted }]}>{o.hint}</Text>
            </View>
            <Ionicons
              name={active ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={active ? colors.primary : colors.muted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 15, fontWeight: '700', marginTop: 24 },
  sub: { fontSize: 12, marginTop: 3, marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 12, marginBottom: 10 },
  iconBox: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '800' },
  hint: { fontSize: 12, marginTop: 2, lineHeight: 16 },
});