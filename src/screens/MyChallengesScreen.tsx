
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import { CHALLENGE_IMAGES } from '../data/challengeImages';
import { useTheme } from '../theme/useTheme';
import useMyChallengesViewModel, {
  type JoinedChallenge,
  type MyChallengeFilter,
} from '../viewmodels/MyChallengesViewModel';

interface Props {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onOpenChallenge: (challengeId: string) => void;
  onUploadEvidence: (challengeId: string, title: string) => void;
}

const FILTERS: MyChallengeFilter[] = [
  'All',
  'Active',
  'Completed',
];

export default function MyChallengesScreen({
  onBack,
  onNavigate,
  onOpenChallenge,
  onUploadEvidence,
}: Props) {
  const { colors, isDark } = useTheme();
  const vm = useMyChallengesViewModel();

  const cardColor = isDark ? '#241C40' : '#FFFFFF';
  const borderColor = isDark ? '#3B3159' : '#E6E0F7';
  const secondaryText = colors.muted;
  const lime = colors.lime;

  const renderChallenge = ({ item }: { item: JoinedChallenge }) => (
    <View
      style={[
        styles.challengeCard,
        {
          backgroundColor: cardColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Image
          source={CHALLENGE_IMAGES[item.category]}
          style={styles.challengeImage}
          resizeMode="cover"
          accessibilityLabel={`${item.category} challenge`}
        />

        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text
            style={[styles.description, { color: secondaryText }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.isCompleted
                ? lime
                : isDark
                  ? '#35265B'
                  : '#EEE8FF',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.isCompleted ? '#171326' : colors.primary },
            ]}
          >
            {item.isCompleted ? 'Completed' : 'Active'}
          </Text>
        </View>
      </View>

      <View style={styles.progressLabels}>
        <Text style={[styles.meta, { color: secondaryText }]}>
          {item.completedDays}/{item.durationDays} days
        </Text>
        <Text style={[styles.percentage, { color: colors.primary }]}>
          {item.progress}%
        </Text>
      </View>

      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDark ? '#44385F' : '#E9E3F7' },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${item.progress}%`,
              backgroundColor: item.isCompleted ? lime : colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons
            name="people-outline"
            size={16}
            color={secondaryText}
          />
          <Text style={[styles.meta, { color: secondaryText }]}>
            {item.participants} joined
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="trophy-outline"
            size={16}
            color={secondaryText}
          />
          <Text style={[styles.meta, { color: secondaryText }]}>
            {item.reward} points
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.remaining, { color: secondaryText }]}>
          {item.isCompleted
            ? 'All challenge days completed!'
            : `${item.daysLeft} days remaining`}
        </Text>

        <View style={styles.footerActions}>
          {!item.isCompleted && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Upload evidence for ${item.title}`}
              onPress={() => onUploadEvidence(item.id, item.title)}
              style={[
                styles.detailsButton,
                styles.footerActionButton,
                {
                  backgroundColor: 'transparent',
                  borderColor: colors.primary,
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons
                name="camera-outline"
                size={16}
                color={colors.primary}
              />
              <Text
                style={[
                  styles.detailsButtonText,
                  styles.evidenceButtonText,
                  { color: colors.primary },
                ]}
              >
                Upload Evidence
              </Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              item.isCompleted
                ? `View ${item.title} details`
                : `Continue ${item.title}`
            }
            onPress={() => onOpenChallenge(item.id)}
            style={[
              styles.detailsButton,
              !item.isCompleted && styles.footerActionButton,
              {
                backgroundColor: item.isCompleted
                  ? 'transparent'
                  : colors.primary,
                borderColor: colors.primary,
                borderWidth: item.isCompleted ? 1 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.detailsButtonText,
                {
                  color: item.isCompleted ? colors.primary : '#FFFFFF',
                },
              ]}
            >
              {item.isCompleted ? 'View details' : 'Continue'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={item.isCompleted ? colors.primary : '#FFFFFF'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={vm.loading}
            onRefresh={vm.refresh}
            tintColor={colors.primary}
          />
        }
      >
        <BrandHeader />
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: cardColor, borderColor },
            ]}
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              YOUR FITNESS JOURNEY
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              My Challenges
            </Text>
            <Text style={[styles.subtitle, { color: secondaryText }]}>
              Every step takes you closer.
            </Text>
          </View>

          <View
            style={[
              styles.trophyCircle,
              { backgroundColor: cardColor },
            ]}
          >
            <Ionicons name="trophy" size={27} color={lime} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="flash-outline"
            label="Active"
            value={vm.activeCount}
            colors={colors}
            cardColor={cardColor}
          />
          <StatCard
            icon="checkmark-circle-outline"
            label="Completed"
            value={vm.completedCount}
            colors={colors}
            cardColor={cardColor}
          />
          <StatCard
            icon="layers-outline"
            label="Joined"
            value={vm.totalCount}
            colors={colors}
            cardColor={cardColor}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Your journey
        </Text>

        <View style={styles.filters}>
          {FILTERS.map((filter) => {
            const selected = vm.filter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => vm.setFilter(filter)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : cardColor,
                    borderColor: selected
                      ? colors.primary
                      : borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selected ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {vm.loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : vm.challenges.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: isDark ? '#35265B' : '#EEE8FF' },
              ]}
            >
              <Ionicons
                name="trophy-outline"
                size={35}
                color={colors.primary}
              />
            </View>

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {vm.filter === 'Completed'
                ? 'No completed challenges yet'
                : vm.filter === 'Active'
                  ? 'No active challenges'
                  : 'Your journey starts here'}
            </Text>

            <Text
              style={[styles.emptyDescription, { color: secondaryText }]}
            >
              {vm.filter === 'All'
                ? 'Explore challenges and join one to start tracking your progress.'
                : 'Join a challenge and keep working towards your next milestone.'}
            </Text>

            {vm.filter !== 'Completed' && (
              <Pressable
                onPress={() => onNavigate('Challenges')}
                style={[
                  styles.exploreButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.exploreButtonText}>
                  Explore challenges
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>
        ) : (
          <FlatList
            data={vm.challenges}
            keyExtractor={(item) => item.id}
            renderItem={renderChallenge}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          />
        )}

        <Pressable
          onPress={() => onNavigate('Challenges')}
          style={[
            styles.discoverButton,
            { backgroundColor: lime },
          ]}
        >
          <Ionicons name="compass-outline" size={21} color="#171326" />
          <Text style={styles.discoverText}>Discover more challenges</Text>
          <Ionicons name="arrow-forward" size={20} color="#171326" />
        </Pressable>
      </ScrollView>
      <BottomNav
        colors={colors}
        activeScreen="My Challenges"
        onNavigate={onNavigate}
      />
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  colors,
  cardColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: number;
  colors: ReturnType<typeof useTheme>['colors'];
  cardColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: cardColor }]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={[styles.statValue, { color: colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 5,
  },
  title: { fontSize: 25, fontWeight: '900' },
  subtitle: { fontSize: 12, marginTop: 4 },
  trophyCircle: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 26 },
  statCard: {
    flex: 1,
    minHeight: 105,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 13 },
  filters: { flexDirection: 'row', gap: 9, marginBottom: 18 },
  filterButton: {
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  filterText: { fontSize: 13, fontWeight: '700' },
  challengeCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 15,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  challengeImage: {
    width: 64,
    height: 64,
    borderRadius: 15,
  },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 15, fontWeight: '800' },
  description: { fontSize: 11, marginTop: 5, lineHeight: 16 },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { fontSize: 10, fontWeight: '800' },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 19,
    marginBottom: 8,
  },
  meta: { fontSize: 11 },
  percentage: { fontSize: 12, fontWeight: '900' },
  progressTrack: { height: 8, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8 },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 15,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cardFooter: {
    gap: 10,
    marginTop: 17,
  },
  remaining: { fontSize: 11 },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  footerActionButton: { flex: 1 },
  evidenceButtonText: { fontSize: 11 },
  detailsButton: {
    minHeight: 39,
    paddingHorizontal: 12,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  detailsButtonText: { fontSize: 12, fontWeight: '800' },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 9,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 18,
  },
  exploreButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  loader: { marginVertical: 40 },
  discoverButton: {
    minHeight: 54,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
  },
  discoverText: { color: '#171326', fontWeight: '900', fontSize: 13 },
});
