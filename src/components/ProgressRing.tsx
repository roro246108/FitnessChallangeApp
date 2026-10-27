import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/useTheme';
import { Colors } from '../theme/Color';

interface Props {
  percent: number;
  size?: number;
  stroke?: number;
}

export default function ProgressRing({ percent, size = 96, stroke = 10 }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const center = size / 2;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>

      <Text style={styles.percent}>{percent}%</Text>
      <Text style={styles.label}>of goal</Text>
    </View>
  );
}

const makeStyles = (c: Colors) =>
  StyleSheet.create({
    wrapper: { alignItems: 'center', justifyContent: 'center' },
    percent: { fontSize: 22, fontWeight: '800', color: c.text },
    label: { fontSize: 11, color: c.muted, marginTop: -2 },
  });
