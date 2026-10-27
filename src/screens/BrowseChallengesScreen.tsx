import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import BottomNav from '../components/BottomNav';
import BrowseChallengeCard from '../components/BrowseChallengeCard';
import useBrowseChallengesViewModel, {
  type ChallengeCategory,
} from '../viewmodels/BrowseChallengesViewModel';
import type { Colors } from '../theme/Color';




interface BrowseChallengesScreenProps {
  colors: Colors;
  darkMode: boolean;
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onOpenChallenge: (challengeId: string) => void; 
}



export default function BrowseChallengesScreen({
  colors,
  darkMode,
  onBack,
  onNavigate,
  onOpenChallenge,
}: BrowseChallengesScreenProps) {

  const vm = useBrowseChallengesViewModel();

  const categoryIcons: Record<ChallengeCategory, string> = {
    All: '▦',
    Steps: '👟',
    Cardio: '♥',
    Strength: '⚒',
    Flexibility: '♧',
  };

  

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Back to home"
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Browse Challenges
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Find the perfect challenge for your goals
            </Text>
          </View>

          <Text style={[styles.filterIcon, { color: colors.primary }]}>
            ☷
          </Text>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.track,
            },
          ]}
        >
          <Text style={[styles.searchIcon, { color: colors.muted }]}>
            ⌕
          </Text>

          <TextInput
            value={vm.searchQuery}
            onChangeText={vm.setSearchQuery}
            placeholder="Search challenges..."
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
            accessibilityLabel="Search challenges"
          />

          {vm.searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => vm.setSearchQuery('')}
              accessibilityLabel="Clear search"
            >
              <Text style={{ color: colors.muted, fontSize: 19 }}>
                ×
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {vm.categories.map((category) => {
            const selected = vm.selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                onPress={() => vm.setSelectedCategory(category)}
                style={[
                  styles.category,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : colors.card,
                    borderColor: colors.track,
                  },
                ]}
              >
                <Text style={styles.categoryIcon}>
                  {categoryIcons[category]}
                </Text>

                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selected ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Challenge list */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Featured Challenges
          </Text>

          <Text style={[styles.resultCount, { color: colors.primary }]}>
            {vm.challenges.length}{' '}
            {vm.challenges.length === 1 ? 'challenge' : 'challenges'}
          </Text>
        </View>

        {vm.challenges.length > 0 ? (
          vm.challenges.map((challenge) => (
            <BrowseChallengeCard
  key={challenge.id}
  challenge={challenge}
  colors={colors}
  joined={vm.joinedChallenges.includes(challenge.id)}
  onJoin={() => vm.toggleJoin(challenge.id)}
  onPress={() => onOpenChallenge(challenge.id)}
/> 
          ))
        ) : (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: colors.card },
            ]}
          >
            <Text style={{ fontSize: 38 }}>🔎</Text>

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No challenges found
            </Text>

            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Try another search or category.
            </Text>

            <TouchableOpacity
              onPress={() => {
                vm.setSearchQuery('');
                vm.setSelectedCategory('All');
              }}
              style={[
                styles.resetButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.resetButtonText}>
                Clear filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.card,
            borderColor: colors.track,
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem} onPress={onBack}>
          <Text style={[styles.navIcon, { color: colors.muted }]}>
            ⌂
          </Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: colors.primary }]}>
            ⚑
          </Text>
          <Text style={[styles.navLabel, { color: colors.primary }]}>
            Challenges
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => onNavigate('Record Workout')}
          accessibilityLabel="Record workout"
        >
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('Leaderboard')}
        >
          <Text style={[styles.navIcon, { color: colors.muted }]}>
            ▥
          </Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Leaderboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('Profile')}
        >
          <Text style={[styles.navIcon, { color: colors.muted }]}>
            
          </Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
      <BottomNav
        colors={colors}
        activeScreen="Challenges"
        onNavigate={onNavigate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  backButton: {
    width: 27,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 38,
    lineHeight: 42,
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 21,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 5,
  },
  filterIcon: {
    fontSize: 27,
    paddingHorizontal: 3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 13,
    height: 47,
    marginBottom: 17,
  },
  searchIcon: {
    fontSize: 27,
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8,
  },
  categoryList: {
    gap: 9,
    paddingBottom: 22,
  },
  category: {
    width: 75,
    height: 78,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 22,
    color: '#A38DF2',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  resultCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    borderRadius: 18,
    padding: 28,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    marginTop: 7,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 16,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  bottomNav: {
    minHeight: 62,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '700',
  },
  navLabel: {
    fontSize: 9,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 35,
  },
});
