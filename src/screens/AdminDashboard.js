import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { lightColors, darkColors } from '../theme/Color';

export default function AdminDashboard() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ScrollView
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.subtitle, { color: colors.lavender }]}>
        ADMIN PANEL
      </Text>

      <Text style={[styles.title, { color: colors.text }]}>
        Dashboard
      </Text>

      <Text style={[styles.description, { color: colors.text }]}>
        Track users and challenge participation.
      </Text>

      {/* Sample statistics */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.number, { color: colors.primary }]}>
          120
        </Text>
        <Text style={[styles.label, { color: colors.text }]}>
          Total Users
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.number, { color: colors.primary }]}>
          8
        </Text>
        <Text style={[styles.label, { color: colors.text }]}>
          Active Challenges
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.number, { color: colors.primary }]}>
          75%
        </Text>
        <Text style={[styles.label, { color: colors.text }]}>
          Completion Rate
        </Text>
      </View>

      <View
        style={[
          styles.highlight,
          { backgroundColor: colors.lime },
        ]}
      >
        <Text style={styles.highlightText}>
          Welcome to your admin dashboard!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    opacity: 0.75,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  number: {
    fontSize: 32,
    fontWeight: '800',
  },
  label: {
    fontSize: 15,
    marginTop: 8,
  },
  highlight: {
    padding: 20,
    borderRadius: 20,
    marginTop: 8,
  },
  highlightText: {
    color: '#171326',
    fontSize: 15,
    fontWeight: '600',
  },
});