import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { IoniconName } from '../models/icons';

interface Props {
  name: IoniconName;
  size?: number;
}

// Soft lavender rounded square with an icon, used across the screen.
export default function IconBadge({ name, size = 44 }: Props) {
  const { colors, isDark } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.34,
        backgroundColor: colors.lavender + '33',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={name}
        size={size * 0.5}
        color={isDark ? colors.lavender : colors.primary}
      />
    </View>
  );
}
