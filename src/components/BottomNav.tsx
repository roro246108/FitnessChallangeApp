import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Colors } from '../theme/Color';

export interface BottomNavProps {
  colors: Colors;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

interface NavItem {
  icon: string;
  label: string;
  screen: string;
}




const NAV_ITEMS: NavItem[] = [
  { icon: '⌂', label: 'Home', screen: 'Home' },
  { icon: '⚑', label: 'Challenges', screen: 'Challenges' },
  { icon: '▤', label: 'My Challenges', screen: 'My Challenges' },
  { icon: '▥', label: 'Leaderboard', screen: 'Leaderboard' },
  { icon: '◉', label: 'Profile', screen: 'Profile' },
];




export default function BottomNav({
  colors,
  activeScreen,
  onNavigate,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const activeLabelColor =
    colors.scheme === 'dark' ? colors.lime : colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.track,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.screen === activeScreen;

        return (
          <TouchableOpacity
            key={item.label}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onNavigate(item.screen)}
            style={styles.item}
          >
            <View
              style={[
                styles.iconWrap,
                isActive && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  { color: isActive ? colors.lime : colors.muted },
                ]}
              >
                {item.icon}
              </Text>
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: isActive ? activeLabelColor : colors.muted,
                  fontSize: item.screen === 'My Challenges' ? 8 : 9,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    minWidth: 38,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  icon: {
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
    textAlign: 'center',
  },
});
