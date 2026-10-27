import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface BrandHeaderProps {
  inverse?: boolean;
}

export default function BrandHeader({ inverse = false }: BrandHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="MoveWell fitness"
      style={styles.container}
    >
      <Image source={require('../assets/MoveWellLogo.png')} style={styles.logo} />
      <Text style={[styles.name, { color: inverse ? '#FFFFFF' : colors.text }]}>
        MOVEWELL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
});
