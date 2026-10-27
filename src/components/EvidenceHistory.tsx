import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { STATUS_COLORS } from '../theme/uploadEvidenceStyles';
import ConfirmSheet from './ConfirmSheet';
import type { EvidenceRecord } from '../viewmodels/useEvidenceHistory';

const STATUS_LABEL = { pending: 'Pending', verified: 'Verified', rejected: 'Rejected' } as const;
const STATUS_COLOR = {
  pending: STATUS_COLORS.pending,
  verified: STATUS_COLORS.verified,
  rejected: STATUS_COLORS.rejected,
} as const;

function Thumb({ uri }: { uri: string }) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return (
      <View style={[styles.thumb, { backgroundColor: colors.track }]}>
        <Ionicons name="image-outline" size={22} color={colors.muted} />
      </View>
    );
  }
  return <Image source={{ uri }} style={styles.thumb} onError={() => setFailed(true)} />;
}

interface Props {
  records: EvidenceRecord[];
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export default function EvidenceHistory({ records, onDelete, onToggleVisibility }: Props) {
  const { colors } = useTheme();
  const [pendingDelete, setPendingDelete] = useState<EvidenceRecord | null>(null);

  return (
    <View>
      <View style={styles.head}>
        <Text style={[styles.title, { color: colors.text }]}>Past submissions</Text>
        <Text style={[styles.count, { color: colors.muted }]}>{records.length}</Text>
      </View>

      {records.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: colors.card }]}>
          <Text style={{ fontSize: 28 }}>📸</Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            No proofs yet. Your uploads for this challenge will show up here.
          </Text>
        </View>
      ) : (
        records.map((r) => {
          const d = new Date(r.submittedAt);
          const color = STATUS_COLOR[r.status];
          const shared = r.visibility === 'community';
          return (
            <View key={r.id} style={[styles.row, { backgroundColor: colors.card, borderColor: colors.track }]}>
              <Thumb uri={r.uri} />

              <View style={{ flex: 1 }}>
                <Text style={[styles.date, { color: colors.text }]}>
                  {d.toLocaleDateString([], { month: 'short', day: 'numeric' })} •{' '}
                  {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.note, { color: colors.muted }]} numberOfLines={1}>
                  {shared ? '🏆 Community • ' : '🔒 Private • '}
                  {r.note ? r.note : 'No note'}
                </Text>
                <View style={[styles.chip, { backgroundColor: color + '22' }]}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <Text style={{ color, fontSize: 11, fontWeight: '800' }}>{STATUS_LABEL[r.status]}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => onToggleVisibility(r.id)}
                  style={[styles.iconBtn, { backgroundColor: shared ? colors.lime : colors.track }]}
                  accessibilityLabel={shared ? 'Make private' : 'Share with community'}
                >
                  <Feather name={shared ? 'users' : 'lock'} size={15} color={shared ? '#171326' : colors.muted} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPendingDelete(r)}
                  style={[styles.iconBtn, { backgroundColor: colors.track }]}
                  accessibilityLabel="Delete submission"
                >
                  <Feather name="trash-2" size={15} color="#E5484D" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

      <ConfirmSheet
        visible={!!pendingDelete}
        title="Delete this submission?"
        message="The proof will be removed from your history and from the community. This can't be undone."
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) onDelete(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 10 },
  title: { fontSize: 15, fontWeight: '700' },
  count: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', borderRadius: 20, padding: 22, gap: 8 },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 18, padding: 10, marginBottom: 10 },
  thumb: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  date: { fontSize: 14, fontWeight: '700' },
  note: { fontSize: 12, marginTop: 3 },
  chip: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10, marginTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  actions: { gap: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});