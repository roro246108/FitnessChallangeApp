import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import BrandHeader from '../components/BrandHeader';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export default function OnboardingScreen({
  onGetStarted,
}: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={require('../assets/photos/running.jpg')}
        style={styles.hero}
        imageStyle={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />

        <BrandHeader />

        <View style={styles.content}>
          <Text style={styles.eyebrow}>YOUR STRONGER SELF</Text>

          <Text style={styles.title}>
            Move{' '}
            <Text style={styles.purple}>Better</Text>
            {'\n'}Feel{' '}
            <Text style={styles.purple}>Happier</Text>
          </Text>

          <Text style={styles.description}>
            Personalized workouts, nutrition and habits for a healthier you.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={onGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.dots}>
            <View style={styles.activeDot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FF',
  },

  hero: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 65,
    paddingHorizontal: 26,
    paddingBottom: 35,
  },

  heroImage: {
    opacity: 0.9,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(247, 246, 255, 0.48)',
  },

  content: {
    marginTop: 'auto',
  },

  eyebrow: {
    color: '#6F4BF2',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 17,
  },

  title: {
    color: '#171326',
    fontSize: 43,
    lineHeight: 48,
    fontWeight: '900',
  },

  purple: {
    color: '#6F4BF2',
  },

  description: {
    color: '#625B7D',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 18,
    maxWidth: 270,
  },

  button: {
    backgroundColor: '#CDFF7E',
    borderRadius: 30,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    gap: 15,
  },

  buttonText: {
    color: '#171326',
    fontSize: 16,
    fontWeight: '800',
  },

  arrow: {
    color: '#171326',
    fontSize: 24,
    fontWeight: '700',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
  },

  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#6F4BF2',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C8BDF5',
  },
});