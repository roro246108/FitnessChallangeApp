import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Colors } from '../theme/Color';
import {
  CATEGORY_UNIT,
  GOAL_CATEGORIES,
  GOAL_RANGES,
  type Goal,
  type GoalCategory,
  type GoalRange,
  type NewGoalInput,
} from '../viewmodels/useMyGoalsViewModel';
import { CATEGORY_ICON, INK } from '../data/goalMeta';

interface Props {
  visible: boolean;
  editing: Goal | null;
  colors: Colors;
  defaultPeriod: GoalRange;
  onClose: () => void;
  onSave: (input: NewGoalInput) => void;
}

export default function NewGoalModal({ visible, editing, colors, defaultPeriod, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Steps');
  const [targetText, setTargetText] = useState('');
  const [period, setPeriod] = useState<GoalRange>(defaultPeriod);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    if (editing) {
      setTitle(editing.title);
      setCategory(editing.category);
      setTargetText(String(editing.target));
      setPeriod(editing.period);
    } else {
      setTitle('');
      setCategory('Steps');
      setTargetText('');
      setPeriod(defaultPeriod);
    }
    setError('');
  }, [visible, defaultPeriod, editing]);

  const submit = () => {
    const target = Number(targetText.replace(/[^0-9]/g, ''));
    if (title.trim().length < 2) return setError('Give your goal a name (at least 2 letters).');
    if (!target || target <= 0) return setError('Enter a target number greater than 0.');
    onSave({ title, category, target, period });
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.card, borderColor: colors.track, color: colors.text },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.track }]} />
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              {editing ? 'Edit goal' : 'Set new goal'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: colors.muted }]}>Goal name</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Run 5K"
              placeholderTextColor={colors.muted}
              style={inputStyle}
            />

            <Text style={[styles.label, { color: colors.muted }]}>Category</Text>
            <View style={styles.chips}>
              {GOAL_CATEGORIES.map((c) => {
                const active = c === category;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? colors.primary : colors.card,
                        borderColor: colors.track,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? '#FFFFFF' : colors.text, fontWeight: '600', fontSize: 12 }}>
                      {CATEGORY_ICON[c]} {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, { color: colors.muted }]}>
              Target ({CATEGORY_UNIT[category]})
            </Text>
            <TextInput
              value={targetText}
              onChangeText={setTargetText}
              placeholder="e.g. 10000"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              style={inputStyle}
            />

            <Text style={[styles.label, { color: colors.muted }]}>Repeat</Text>
            <View style={styles.chips}>
              {GOAL_RANGES.map((p) => {
                const active = p === period;
                const label = p === 'Day' ? 'Daily' : p === 'Week' ? 'Weekly' : 'Monthly';
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={[
                      styles.chip,
                      {
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: active ? colors.primary : colors.card,
                        borderColor: colors.track,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? '#FFFFFF' : colors.text, fontWeight: '600', fontSize: 12 }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              onPress={submit}
              activeOpacity={0.85}
              style={[styles.save, { backgroundColor: colors.lime }]}
            >
              <Text style={styles.saveText}>{editing ? 'Save changes' : 'Save goal'}</Text>
              <Feather name="check" size={18} color={INK} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 28,
    maxHeight: '88%',
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, marginBottom: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', marginTop: 18, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 48, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  error: { color: '#E5484D', fontSize: 12, fontWeight: '600', marginTop: 14 },
  save: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 22,
  },
  saveText: { fontSize: 15, fontWeight: '800', color: INK },
});