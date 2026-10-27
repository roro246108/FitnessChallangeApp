import React, { useEffect, useRef, ReactNode } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { NATIVE } from '../theme/motion';

interface Props {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export default function FadeInUp({ children, delay = 0, style }: Props) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 500, delay, useNativeDriver: NATIVE }).start();
  }, [v, delay]);

  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });

  return <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>{children}</Animated.View>;
}