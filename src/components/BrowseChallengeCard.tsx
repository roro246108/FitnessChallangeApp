import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import type { Challenge } from '../models/ActivityModel';

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
  onPress: () => void;
}

export default function BrowseChallengeCard({
  challenge,
  colors,
  joined,
  onJoin,
  onPress,
}: BrowseChallengeCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.track,
        },
      ]}
    >
      <View style={styles.cover}>
        <Text style={styles.coverEmoji}>{challenge.icon}</Text>

        {challenge.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>🔥 Popular</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.text }]}>
          {challenge.title}
        </Text>

        <Text style={[styles.description, { color: colors.muted }]}>
          {challenge.description}
        </Text>

        <View style={styles.metadata}>
          <Text style={[styles.metaText, { color: colors.muted }]}>
            ▦ {challenge.duration} days
          </Text>
          <Text style={styles.reward}>👑 +{challenge.reward}</Text>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    padding: 9,
    marginBottom: 13,
    gap: 11,
    minHeight: 176,
  },
  cover: {
    width: '36%',
    minHeight: 155,
    borderRadius: 13,
    backgroundColor: '#D8A4ED',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverEmoji: {
    fontSize: 55,
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
    minHeight: 36,
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