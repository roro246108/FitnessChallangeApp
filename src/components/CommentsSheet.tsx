import React, { useState } from 'react';
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
import { useTheme } from '../theme/useTheme';
import type { PostView } from '../viewmodels/useCommunityViewModel';

interface Props {
  post: PostView | null;
  onClose: () => void;
  onSend: (text: string) => void;
}

export default function CommentsSheet({ post, onClose, onSend }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const send = () => {
    onSend(text);
    setText('');
  };

  return (
    <Modal visible={!!post} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.track }]} />
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              Comments{post ? ` (${post.comments.length})` : ''}
            </Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <Feather name="x" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 300 }} keyboardShouldPersistTaps="handled">
            {post && post.comments.length === 0 && (
              <Text style={{ color: colors.muted, textAlign: 'center', marginVertical: 24 }}>
                No comments yet. Be the first to cheer them on! 🎉
              </Text>
            )}
            {post?.comments.map((c) => (
              <View key={c.id} style={styles.comment}>
                <View style={[styles.cAvatar, { backgroundColor: colors.lavender }]}>
                  <Text style={{ fontWeight: '800', color: '#171326' }}>{c.author.charAt(0)}</Text>
                </View>
                <View style={[styles.bubble, { backgroundColor: colors.card }]}>
                  <Text style={{ color: colors.text, fontWeight: '800', fontSize: 12 }}>
                    {c.author} <Text style={{ color: colors.muted, fontWeight: '500' }}>• {c.time}</Text>
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 13, marginTop: 3 }}>{c.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a comment..."
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.track, color: colors.text }]}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.lime }]} onPress={send} accessibilityLabel="Send">
              <Feather name="send" size={18} color="#171326" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 28 },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, marginBottom: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '800' },
  comment: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  cAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  bubble: { flex: 1, borderRadius: 16, padding: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  input: { flex: 1, height: 46, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});