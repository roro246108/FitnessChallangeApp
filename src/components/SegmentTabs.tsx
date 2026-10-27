import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { NATIVE } from '../theme/motion';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, IconName> = {
  Rules: 'document-text-outline',
  Details: 'information-circle-outline',
  Rewards: 'gift-outline',
  Community: 'people-outline',
};

interface Props<T extends string> {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
}

export default function SegmentTabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const index = useRef(new Animated.Value(Math.max(tabs.indexOf(active), 0))).current;

  useEffect(() => {
    Animated.spring(index, {
      toValue: Math.max(tabs.indexOf(active), 0),
      useNativeDriver: NATIVE,
      friction: 8,
      tension: 80,
    }).start();
  }, [active, tabs, index]);

  const tabW = width / tabs.length;
  const lineW = tabW * 0.6;
  const translateX = index.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => i * tabW + (tabW - lineW) / 2),
  });

  return (
    <View
      style={[styles.row, { backgroundColor: colors.card }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {tabs.map((t) => {
        const isActive = t === active;
        const color = isActive ? colors.primary : colors.muted;
        return (
          <Pressable key={t} onPress={() => onChange(t)} style={styles.tab}>
            <Ionicons name={ICONS[t] ?? 'ellipse-outline'} size={16} color={color} />
            <Text style={[styles.text, { color, fontWeight: isActive ? '800' : '600' }]} numberOfLines={1}>
              {t}
            </Text>
          </Pressable>
        );
      })}
      {width > 0 && (
        <Animated.View
          style={[
            styles.underline,
            { width: lineW, backgroundColor: colors.primary, transform: [{ translateX }] },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderRadius: 18, overflow: 'hidden' },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  text: { fontSize: 12.5 },
  underline: { position: 'absolute', bottom: 0, left: 0, height: 3, borderRadius: 2 },
});