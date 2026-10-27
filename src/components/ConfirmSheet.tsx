import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { NATIVE } from '../theme/motion';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Stay',
  onConfirm,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(anim, { toValue: 1, useNativeDriver: NATIVE, friction: 9, tension: 70 }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: NATIVE }).start(
        ({ finished }) => finished && setMounted(false),
      );
    }
  }, [visible, anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [260, 0] });

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: anim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { backgroundColor: colors.card, transform: [{ translateY }] }]}>
          <View style={styles.row}>
            <Pressable
              accessibilityLabel={cancelLabel}
              onPress={onCancel}
              style={[styles.close, { backgroundColor: colors.track }]}
            >
              <Ionicons name="close" size={22} color={colors.primary} />
            </Pressable>
            <View style={styles.texts}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
            </View>
          </View>

          <Pressable onPress={onConfirm} style={[styles.confirm, { backgroundColor: colors.primary }]}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 32,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800' },
  message: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  confirm: { height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  confirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});