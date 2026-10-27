import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import useCommunityViewModel from '../viewmodels/useCommunityViewModel';
import CommunityPostCard from './CommunityPostCard';
import CommentsSheet from './CommentsSheet';

interface Props {
  challengeTitle: string;
}

export default function CommunityTab({ challengeTitle }: Props) {
  const { colors } = useTheme();
  const vm = useCommunityViewModel(challengeTitle);
  const [openId, setOpenId] = useState<string | null>(null);
  const openPost = vm.posts.find((p) => p.id === openId) ?? null;

  return (
    <View>
      <View style={[styles.note, { backgroundColor: colors.card }]}>
        <Text style={{ fontSize: 16 }}>🏆</Text>
        <Text style={[styles.noteText, { color: colors.muted }]}>
          Proofs shared with this challenge's community. Posts from other participants are demo data for now.
        </Text>
      </View>

      {vm.posts.map((p) => (
        <CommunityPostCard
          key={p.id}
          post={p}
          onReact={(r) => vm.react(p.id, r)}
          onOpenComments={() => setOpenId(p.id)}
        />
      ))}

      <CommentsSheet
        post={openPost}
        onClose={() => setOpenId(null)}
        onSend={(text) => openPost && vm.addComment(openPost.id, text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, padding: 12, marginBottom: 14 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 17 },
});