
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import type { Challenge } from '../models/ActivityModel';

// Images are selected according to the challenge category.
const challengeImages: Record<string, number> = {
  Steps: require('../assets/photos/steps.jpg'),
  Strength: require('../assets/photos/Strength.jpg'),
  Cardio: require('../assets/photos/Cardio.jpg'),
  Flexibility: require('../assets/photos/flexibility.jpg'),
};

interface BrowseChallengeCardProps {
  challenge: Challenge;
  colors: {
    card: string;
    track: string;
    text: string;
    muted: string;
    primary: string;
  };
  joined: boolean;
  onJoin: () => void;
}

export default function BrowseChallengeCard({
  challenge,
  colors,
  joined,
  onJoin,
}: BrowseChallengeCardProps) {
  const imageSource =
    challengeImages[challenge.category] ?? challengeImages.Cardio;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.track,
        },
      ]}
    >
      {/* Challenge photo */}
      <ImageBackground
        source={imageSource}
        style={styles.cover}
        imageStyle={styles.coverImage}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />

        {challenge.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>🔥 Popular</Text>
          </View>
        )}

        <View style={styles.photoLabel}>
          <Text style={styles.photoLabelText}>
            {challenge.category}
          </Text>
        </View>
      </ImageBackground>

      {/* Challenge details */}
      <View style={styles.details}>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
        >
          {challenge.title}
        </Text>

        <Text
          style={[styles.description, { color: colors.muted }]}
          numberOfLines={3}
        >
          {challenge.description}
        </Text>

        <View style={styles.metadata}>
          <Text style={[styles.metaText, { color: colors.muted }]}>
            ▦ {challenge.duration} days
          </Text>

          <Text style={styles.reward}>
            👑 +{challenge.reward}
          </Text>

          <Text style={[styles.metaText, { color: colors.muted }]}>
            👥 {challenge.participants}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onJoin}
          style={[
            styles.joinButton,
            {
              backgroundColor: joined ? colors.track : colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.joinText,
              { color: joined ? colors.text : '#FFFFFF' },
            ]}
          >
            {joined ? 'Joined ✓' : 'Join Challenge →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 13,
    gap: 11,
    minHeight: 176,
    overflow: 'hidden',
  },

  
cover: {
  width: '36%',
  minHeight: 155,
  borderRadius: 14,
  overflow: 'hidden',
  justifyContent: 'flex-end',
  backgroundColor: '#D8A4ED',
},

coverImage: {
  width: '100%',
  height: '100%',
  borderRadius: 14,
},


 
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 10, 40, 0.12)',
  },

  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(25, 15, 45, 0.88)',
  },

  popularText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },

  photoLabel: {
    backgroundColor: 'rgba(20, 10, 40, 0.62)',
    paddingVertical: 7,
    paddingHorizontal: 4,
  },

  photoLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },

  details: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 3,
    gap: 8,
  },

  title: {
    fontSize: 13,
    fontWeight: '800',
  },

  description: {
    fontSize: 11,
    lineHeight: 16,
  },

  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },

  metaText: {
    fontSize: 9,
    fontWeight: '600',
  },

  reward: {
    fontSize: 10,
    color: '#F5A623',
    fontWeight: '800',
  },

  joinButton: {
    minHeight: 38,
    paddingHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  joinText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
