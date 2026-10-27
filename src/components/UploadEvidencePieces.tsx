import React, { useEffect, useRef, ReactNode } from 'react';
import { View, Text, Animated, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EvidenceStatus } from '../models/evidence';
import { IoniconName } from '../models/icons';
import type { Styles, Theme } from '../theme/uploadEvidenceStyles';

const STEPS = ['Photo', 'Upload', 'Verified'] as const;

interface PulseProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

export function Pulse({ children, style, active = true }: PulseProps) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, v]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}

interface StepIndicatorProps {
  current: number;
  status: EvidenceStatus | null;
  t: Theme;
  s: Styles;
}

export function StepIndicator({ current, status, t, s }: StepIndicatorProps) {
  return (
    <View style={s.stepsRow}>
      {STEPS.map((label, i) => {
        const done = i < current || (i === 2 && status === 'verified');
        const active = i === current && !done;
        return (
          <React.Fragment key={label}>
            <View style={s.stepItem}>
              <View
                style={[
                  s.stepCircle,
                  done && { backgroundColor: t.primary, borderColor: t.primary },
                  active && { borderColor: t.primary, backgroundColor: t.tint },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text style={[s.stepNum, active && { color: t.primary }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[s.stepLabel, (done || active) && { color: t.text, fontWeight: '700' }]}>
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.stepLine, i < current && { backgroundColor: t.primary }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

interface TimelineRowProps {
  icon: IoniconName;
  color: string;
  bg: string;
  title: string;
  sub: string;
  last?: boolean;
  pulse?: boolean;
  s: Styles;
}

export function TimelineRow({ icon, color, bg, title, sub, last, pulse, s }: TimelineRowProps) {
  return (
    <View style={s.tlRow}>
      <View style={s.tlLeft}>
        <Pulse active={!!pulse} style={[s.tlDot, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={16} color={color} />
        </Pulse>
        {!last && <View style={s.tlLine} />}
      </View>
      <View style={s.tlBody}>
        <Text style={s.tlTitle}>{title}</Text>
        <Text style={s.tlSub}>{sub}</Text>
      </View>
    </View>
  );
}