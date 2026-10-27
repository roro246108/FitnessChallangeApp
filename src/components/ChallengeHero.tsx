import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';
import { NATIVE } from '../theme/motion';
import { IoniconName } from '../models/icons';

const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50;

const THEMES: Record<string, { colors: [string, string]; icon: IoniconName }> = {
  Steps: { colors: ['#7C5CFF', '#4B2FD6'], icon: 'walk' },
  Cardio: { colors: ['#F472B6', '#BE185D'], icon: 'heart' },
  Strength: { colors: ['#22A06B', '#0F6B45'], icon: 'barbell' },
  Flexibility: { colors: ['#F5A524', '#C2410C'], icon: 'body' },
};

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(n);

interface Props {
  onBack: () => void;
  scrollY: Animated.Value;
  category: string;
  image?: ImageSourcePropType;
  title: string;
  description: string;
  durationDays: number;
  level: string;
  participants: number;
  liked: boolean;
  onToggleLike: () => void;
}

function RoundButton({
  icon,
  label,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={styles.round}>
      <Ionicons name={icon} size={22} color={colors.primary} />
    </Pressable>
  );
}

function MetaItem({ icon, text }: { icon: IoniconName; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={17} color="#F7F5FF" />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

export default function ChallengeHero({
  onBack,
  scrollY,
  category,
  image,
  title,
  description,
  durationDays,
  level,
  participants,
  liked,
  onToggleLike,
}: Props) {
  const { colors } = useTheme();
  const theme = THEMES[category] || THEMES.Steps;

  const kenBurns = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const imgOpacity = useRef(new Animated.Value(0)).current;
  const heartPop = useRef(new Animated.Value(1)).current;
  const textIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (v: Animated.Value, ms: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: ms, useNativeDriver: NATIVE }),
          Animated.timing(v, { toValue: 0, duration: ms, useNativeDriver: NATIVE }),
        ]),
      );
    const a = loop(kenBurns, 10000);
    const b = loop(drift, 5000);
    a.start();
    b.start();
    Animated.timing(textIn, { toValue: 1, duration: 600, delay: 150, useNativeDriver: NATIVE }).start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [kenBurns, drift, textIn]);

  useEffect(() => {
    imgOpacity.setValue(0);
  }, [image, imgOpacity]);

  const onImageLoad = () =>
    Animated.timing(imgOpacity, { toValue: 1, duration: 600, useNativeDriver: NATIVE }).start();

  const onLike = () => {
    onToggleLike();
    heartPop.setValue(0.6);
    Animated.spring(heartPop, { toValue: 1, friction: 3, useNativeDriver: NATIVE }).start();
  };

  const kbScale = kenBurns.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1.25] });
  const kbX = kenBurns.interpolate({ inputRange: [0, 1], outputRange: [10, -10] });
  const bigX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -24] });
  const bigY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 16] });
  const smallX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 22] });
  const smallY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });

  // scroll parallax
  const imgY = scrollY.interpolate({ inputRange: [0, 300], outputRange: [0, 80], extrapolate: 'clamp' });
  const imgZoom = scrollY.interpolate({ inputRange: [0, 300], outputRange: [1, 1.15], extrapolate: 'clamp' });
  const textUp = scrollY.interpolate({ inputRange: [0, 260], outputRange: [0, -40], extrapolate: 'clamp' });
  const textFade = scrollY.interpolate({ inputRange: [0, 200], outputRange: [1, 0], extrapolate: 'clamp' });

  const enterY = textIn.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <View style={[styles.hero, { paddingTop: TOP_INSET + 10 }]}>
      <LinearGradient
        colors={theme.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {image ? (
        <Animated.Image
          source={image}
          resizeMode="cover"
          onLoad={onImageLoad}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: imgOpacity,
              transform: [{ translateY: imgY }, { scale: imgZoom }, { scale: kbScale }, { translateX: kbX }],
            },
          ]}
        />
      ) : (
        <>
          <Animated.View style={[styles.circleBig, { transform: [{ translateX: bigX }, { translateY: bigY }] }]} />
          <Animated.View style={[styles.circleSmall, { transform: [{ translateX: smallX }, { translateY: smallY }] }]} />
        </>
      )}

      {/* dark at the top for the buttons and at the bottom for the text */}
      <LinearGradient
        colors={['rgba(20,17,43,0.45)', 'rgba(20,17,43,0.05)', 'rgba(20,17,43,0.9)']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topRow}>
        <RoundButton icon="chevron-back" label="Go back" onPress={onBack} />
        <Animated.View style={{ transform: [{ scale: heartPop }] }}>
          <RoundButton
            icon={liked ? 'heart' : 'heart-outline'}
            label="Save challenge"
            onPress={onLike}
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: Animated.multiply(textFade, textIn), transform: [{ translateY: Animated.add(textUp, enterY) }] },
        ]}
      >
        <View style={[styles.chip, { backgroundColor: colors.lime }]}>
          <Ionicons name={theme.icon} size={15} color="#171326" />
          <Text style={styles.chipText}>{category}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          <MetaItem icon="calendar-outline" text={`${durationDays} days`} />
          <View style={styles.sep} />
          <MetaItem icon="stats-chart" text={level} />
          <View style={styles.sep} />
          <MetaItem icon="people-outline" text={`${compact(participants)} joined`} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 52,
    minHeight: 460,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  circleBig: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -60,
    top: -50,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  circleSmall: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    left: -40,
    bottom: 120,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(247,245,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { marginTop: 24 },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 10,
  },
  chipText: { color: '#171326', fontWeight: '700', fontSize: 13 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', lineHeight: 40 },
  desc: { color: 'rgba(255,255,255,0.88)', fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: '85%' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#F7F5FF', fontSize: 14, fontWeight: '600' },
  sep: { width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.35)', marginHorizontal: 12 },
});