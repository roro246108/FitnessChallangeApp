
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import type { Challenge } from '../models/ActivityModel';
import type { Colors } from '../theme/Color';

// Images for each challenge category
const challengeImages: Record<string, number> = {
  Steps: require('../assets/photos/steps.jpg'),
  Strength: require('../assets/photos/Strength.jpg'),
  Cardio: require('../assets/photos/Cardio.jpg'),
  Flexibility: require('../assets/photos/flexibility.jpg'),
};

interface ChallengeCardProps {
  challenge: Challenge;
  colors: Colors;
}

export default function ChallengeCard({
  challenge,
  colors,
}: ChallengeCardProps) {
  const imageSource =
    challengeImages[challenge.category] ??
    challengeImages.Steps;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
      ]}
    >
      {/* Challenge Photo */}
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />
      </ImageBackground>

      {/* Challenge Details */}
      <View style={styles.details}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
          numberOfLines={2}
        >
          {challenge.title}
        </Text>

        {/* Progress Bar */}
        <View
          style={[
            styles.track,
            { backgroundColor: colors.track },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(
                  100,
                  Math.max(0, challenge.progress)
                )}%`,
                backgroundColor: colors.lavender,
              },
            ]}
          />
        </View>

        <Text
          style={[
            styles.dayText,
            { color: colors.muted },
          ]}
        >
          Day {challenge.day} of {challenge.totalDays}
        </Text>
      </View>

      {/* Reward */}
      <Text style={styles.reward}>
        +{challenge.reward} 👑
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderRadius: 17,
    gap: 10,
    marginBottom: 2,
  },

  image: {
    width: 87,
    height: 92,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: '#D9B2F1',
  },

  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 10, 40, 0.06)',
  },

  details: {
    flex: 1,
    gap: 9,
  },

  title: {
    fontWeight: '700',
    fontSize: 12,
  },

  track: {
    height: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    borderRadius: 5,
  },

  dayText: {
    fontSize: 11,
  },

  reward: {
    fontSize: 10,
    color: '#FFB52E',
    fontWeight: '800',
  },
});
