import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import IconBadge from './IconBadge';
import { IoniconName } from '../models/icons';

interface Props {
  icon: IoniconName;
  title: string;
  subtitle?: string;
}

// One list row: icon badge + title (+ optional subtitle).
export default function InfoRow({ icon, title, subtitle }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.card }]}>
      <IconBadge name={icon} size={46} />
      <View style={styles.texts}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
  },
  texts: { flex: 1, marginLeft: 14 },
  title: { fontSize: 15, fontWeight: '700', lineHeight: 21 },
  subtitle: { fontSize: 13, opacity: 0.6, marginTop: 2 },
});
