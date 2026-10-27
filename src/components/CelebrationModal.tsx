import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import type { Goal } from '../viewmodels/useMyGoalsViewModel';

interface Props {
  goal: Goal | null;
  onClose: () => void;
}

export default function CelebrationModal({ goal, onClose }: Props) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (goal) {
      scale.setValue(0.6);
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [goal, scale]);

  return (
    <Modal visible={!!goal} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <Animated.View style={[styles.box, { backgroundColor: colors.card, transform: [{ scale }] }]}>
          <Text style={styles.confetti}>🎊  ✨  🎉  ✨  🎊</Text>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={[styles.title, { color: colors.text }]}>Goal completed!</Text>
          {goal && (
            <Text style={[styles.sub, { color: colors.muted }]}>
              You reached {goal.target.toLocaleString('en-US')} {goal.unit} in “{goal.title}”.
              Keep the streak going!
            </Text>
          )}
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.lime }]} onPress={onClose}>
            <Text style={styles.btnText}>Awesome</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  box: { width: '100%', maxWidth: 360, borderRadius: 28, padding: 24, alignItems: 'center' },
  confetti: { fontSize: 20, letterSpacing: 2 },
  trophy: { fontSize: 70, marginVertical: 10 },
  title: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 8, marginBottom: 18 },
  btn: { width: '100%', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#171326', fontSize: 15, fontWeight: '800' },
});