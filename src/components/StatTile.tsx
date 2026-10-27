import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { IoniconName } from '../models/icons';

interface Props {
  icon: IoniconName;
  value: string;
  label: string;
  highlight?: boolean;
}

export default function StatTile({ icon, value, label, highlight = false }: Props) {
  const { colors } = useTheme();
  const textColor = highlight ? '#171326' : colors.text;

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: highlight ? colors.lime + '55' : colors.card,
          borderColor: highlight ? colors.lime : colors.track,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: highlight ? colors.lime : colors.track }]}>
        <Ionicons name={icon} size={20} color={highlight ? '#171326' : colors.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.value, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
  value: { fontSize: 15, fontWeight: '800' },
  label: { fontSize: 11, opacity: 0.6, marginTop: 1 },
});