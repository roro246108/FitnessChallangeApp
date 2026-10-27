import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Colors } from '../theme/Color';
import type { Goal } from '../viewmodels/useMyGoalsViewModel';
import { CATEGORY_ICON, INK } from '../data/goalMeta';

interface Props {
  goal: Goal;
  colors: Colors;
  onAdd: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GoalItem({ goal, colors, onAdd, onToggle, onEdit, onDelete }: Props) {
  const done = goal.current >= goal.target;
  const pct = Math.min(goal.current / goal.target, 1);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.track }]}>
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: done ? colors.lime : colors.lavender }]}>
          <Text style={{ fontSize: 20 }}>{CATEGORY_ICON[goal.category]}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>{goal.title}</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>
            {goal.current.toLocaleString('en-US')} / {goal.target.toLocaleString('en-US')} {goal.unit}
            {'  •  '}
            {Math.round(pct * 100)}%
          </Text>
        </View>

        <TouchableOpacity onPress={onEdit} style={styles.iconBtn} accessibilityLabel="Edit goal">
          <Feather name="edit-2" size={17} color={colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} style={styles.iconBtn} accessibilityLabel="Delete goal">
          <Feather name="trash-2" size={17} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <View style={[styles.track, { backgroundColor: colors.track }]}>
        <View
          style={[
            styles.fill,
            { width: `${pct * 100}%`, backgroundColor: done ? colors.lime : colors.primary },
          ]}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onAdd}
          disabled={done}
          style={[
            styles.actionBtn,
            { backgroundColor: done ? colors.track : colors.primary, opacity: done ? 0.6 : 1 },
          ]}
        >
          <Feather name="plus" size={14} color={done ? colors.muted : '#FFFFFF'} />
          <Text style={{ color: done ? colors.muted : '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
            Log progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggle}
          style={[
            styles.actionBtn,
            {
              backgroundColor: done ? colors.lime : 'transparent',
              borderWidth: 1.5,
              borderColor: done ? colors.lime : colors.primary,
            },
          ]}
        >
          <Feather name={done ? 'check-circle' : 'circle'} size={14} color={done ? INK : colors.primary} />
          <Text style={{ color: done ? INK : colors.primary, fontWeight: '700', fontSize: 12 }}>
            {done ? 'Completed' : 'Mark done'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, padding: 14, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '800' },
  sub: { fontSize: 12, marginTop: 3 },
  iconBtn: { padding: 6 },
  track: { height: 8, borderRadius: 4, marginTop: 14, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 12,
  },
});