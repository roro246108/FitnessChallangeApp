
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChallengeCard({ challenge, colors }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.image}>
        <Text style={{ fontSize: 32 }}>👟</Text>
      </View>

      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.text }]}>
          {challenge.title}
        </Text>

        <View style={[styles.track, { backgroundColor: colors.track }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${challenge.progress}%`,
                backgroundColor: colors.lavender,
              },
            ]}
          />
        </View>

        <Text style={{ color: colors.muted, fontSize: 11 }}>
          Day {challenge.day} of {challenge.totalDays}
        </Text>
      </View>

      <Text style={styles.reward}>+{challenge.reward} 👑</Text>
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
  },
  image: {
    width: 65,
    height: 68,
    backgroundColor: '#D9B2F1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  reward: {
    fontSize: 10,
    color: '#FFB52E',
    fontWeight: '800',
  },
});
