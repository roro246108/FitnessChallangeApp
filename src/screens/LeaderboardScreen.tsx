import React, { useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type LayoutChangeEvent,
  type ScrollViewInstance,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import type { Colors } from '../theme/Color';
import type { LeaderboardViewModel } from '../viewmodels/LeaderboardViewModel';

interface Props {
  colors: Colors;
  darkMode: boolean;
  vm: LeaderboardViewModel;
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

function formatStreak(streak: number): string {
  if (streak <= 0) {
    return 'No active streak';
  }

  return `🔥 ${streak} day${streak === 1 ? '' : 's'} streak`;
}

interface RankedAvatarProps {
  avatar?: ImageSourcePropType;
  initials: string;
  name: string;
  fallbackColor: string;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  imageStyle: StyleProp<ImageStyle>;
}

function RankedAvatar({
  avatar,
  initials,
  name,
  fallbackColor,
  style,
  textStyle,
  imageStyle,
}: RankedAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(avatar) && !failed;

  return (
    <View
      accessible
      accessibilityLabel={`${name} ${showPhoto ? 'profile photo' : 'avatar'}`}
      style={[style, { backgroundColor: fallbackColor }]}
    >
      {showPhoto ? (
        <Image
          source={avatar}
          style={imageStyle}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={textStyle}>{initials}</Text>
      )}
    </View>
  );
}

export default function LeaderboardScreen({
  colors,
  darkMode,
  vm,
  onBack,
  onNavigate,
}: Props) {
  const s = makeStyles(colors);
  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const badgesOffset = useRef(0);

  const podiumOrder = [vm.podium[1], vm.podium[0], vm.podium[2]];
  const currentUser = vm.currentUser;

  const scrollToBadges = (): void => {
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, badgesOffset.current - 12),
      animated: true,
    });
  };

  const handleBadgesLayout = (event: LayoutChangeEvent): void => {
    badgesOffset.current = event.nativeEvent.layout.y;
  };

  const handleShowLessBadges = (): void => {
    vm.toggleShowAllAchievements();
    requestAnimationFrame(scrollToBadges);
  };

  const handleBack = (): void => {
    if (onBack) {
      onBack();
      return;
    }

    onNavigate?.('Home');
  };

  const handleEmptyAction = (): void => {
    if (vm.filter === '30-Day Challenge') {
      onNavigate?.('Challenges');
      return;
    }

    vm.setFilter('Everyone');
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        <BrandHeader />
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[s.backButton, { backgroundColor: colors.card }]}
            onPress={handleBack}
          >
            <Text style={[s.backText, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>

          <View style={s.headerCenter}>
            <Text style={[s.title, { color: colors.text }]}>Leaderboard</Text>
            <Text style={[s.subtitle, { color: colors.muted }]}>
              Achievements & Rewards
            </Text>
          </View>

          <Text style={s.headerIcon}>♧</Text>
        </View>

        {/* Ranking period */}
        <View style={[s.periodBar, { backgroundColor: colors.card }]}>
          {vm.periods.map((item) => {
            const label =
              item === 'Weekly'
                ? 'This Week'
                : item === 'Monthly'
                  ? 'This Month'
                  : 'All Time';

            const selected = vm.period === item;

            return (
              <TouchableOpacity
                key={item}
                accessibilityRole="button"
                accessibilityLabel={`${label} rankings`}
                accessibilityState={{ selected }}
                onPress={() => vm.setPeriod(item)}
                style={[s.periodButton, selected && s.selectedPeriod]}
              >
                <Text
                  style={[
                    s.periodText,
                    { color: selected ? '#FFFFFF' : colors.muted },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category filters */}
        <View style={s.filterRow}>
          {vm.filters.map((item) => {
            const selected = vm.filter === item;

            return (
              <TouchableOpacity
                key={item}
                accessibilityRole="button"
                accessibilityLabel={`${item} leaderboard`}
                accessibilityState={{ selected }}
                onPress={() => vm.setFilter(item)}
                style={[
                  s.filter,
                  {
                    borderColor: selected ? colors.primary : colors.lavender,
                    backgroundColor: selected
                      ? colors.primary
                      : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    s.filterText,
                    { color: selected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {vm.emptyState ? (
          <View
            style={[
              s.emptyCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.track,
              },
            ]}
          >
            <Text style={s.emptyIcon}>
              {vm.filter === 'Friends' ? '👥' : '⚑'}
            </Text>

            <Text style={[s.emptyTitle, { color: colors.text }]}>
              {vm.emptyState.title}
            </Text>

            <Text style={[s.emptyMessage, { color: colors.muted }]}>
              {vm.emptyState.message}
            </Text>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleEmptyAction}
              style={[s.emptyAction, { backgroundColor: colors.primary }]}
            >
              <Text style={[s.emptyActionText, { color: colors.lime }]}>
                {vm.emptyState.actionLabel}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Top 3 */}
            <View style={s.podium}>
              {podiumOrder.map((user) => {
                if (!user) {
                  return null;
                }

                const isFirst = user.rank === 1;
                const podiumColor = isFirst
                  ? colors.primary
                  : colors.lavender;

                return (
                  <View
                    key={user.id}
                    style={[s.podiumItem, isFirst && s.firstPlace]}
                  >
                    {isFirst && <Text style={s.crown}>👑</Text>}

                    <RankedAvatar
                      avatar={user.avatar}
                      initials={user.initials}
                      name={user.name}
                      fallbackColor={
                        isFirst ? colors.lime : user.avatarColor
                      }
                      style={[s.avatar, { borderColor: podiumColor }]}
                      textStyle={[s.avatarText, { color: '#171329' }]}
                      imageStyle={s.avatarImage}
                    />

                    <Text
                      numberOfLines={1}
                      style={[s.podiumName, { color: colors.text }]}
                    >
                      {user.name}
                    </Text>
                    <Text style={[s.podiumPoints, { color: colors.muted }]}>
                      {user.points.toLocaleString()} pts
                    </Text>

                    <View
                      style={[
                        s.podiumBlock,
                        {
                          height: isFirst ? 110 : user.rank === 2 ? 78 : 60,
                          backgroundColor: podiumColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.rankNumber,
                          { color: isFirst ? '#FFFFFF' : '#171326' },
                        ]}
                      >
                        {user.rank}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Current rank */}
            {currentUser && (
              <View style={s.rankCard}>
                <View style={s.rankTopRow}>
                  <View style={s.youBadge}>
                    <Text style={s.youText}>YOU</Text>
                  </View>

                  <View style={s.rankInfo}>
                    <Text style={s.rankCaption}>
                      Your rank {vm.periodLabel}
                    </Text>
                    <Text style={s.rankValue}>
                      #{vm.currentRank} ·{' '}
                      {currentUser.points.toLocaleString()} pts
                    </Text>
                  </View>

                  <Text style={s.rankChange}>
                    {vm.currentRank === 1
                      ? 'Top rank'
                      : `↑ ${vm.pointsToNextRank.toLocaleString()} pts`}
                  </Text>
                </View>

                <View style={s.progressTrack}>
                  <View
                    style={[
                      s.progressFill,
                      {
                        width: `${vm.rankProgress}%` as `${number}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={s.rankHint}>
                  {vm.currentRank === 1
                    ? "You're at the top of the leaderboard!"
                    : `${vm.pointsToNextRank.toLocaleString()} points to reach #${
                        vm.currentRank - 1
                      }`}
                </Text>
              </View>
            )}

            {/* Rankings */}
            <View style={s.sectionHeader}>
              <Text style={[s.sectionTitle, { color: colors.text }]}>
                Rankings
              </Text>

              {vm.hasMoreRankings ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={
                    vm.showAllRankings
                      ? 'Show fewer rankings'
                      : 'Show all rankings'
                  }
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={vm.toggleShowAllRankings}
                >
                  <Text style={s.seeAll}>
                    {vm.showAllRankings ? 'Show less' : 'See all'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {vm.visibleRankings.map((user) => (
              <View
                key={user.id}
                style={[
                  s.userRow,
                  { backgroundColor: colors.card },
                  user.isCurrentUser && s.currentUserRow,
                ]}
              >
                <Text style={[s.userRank, { color: colors.muted }]}>
                  {user.rank}
                </Text>

                <RankedAvatar
                  avatar={user.avatar}
                  initials={user.initials}
                  name={user.name}
                  fallbackColor={user.avatarColor}
                  style={s.smallAvatar}
                  textStyle={s.smallAvatarText}
                  imageStyle={s.avatarImage}
                />

                <View style={s.userDetails}>
                  <Text
                    numberOfLines={1}
                    style={[s.userName, { color: colors.text }]}
                  >
                    {user.name}
                  </Text>
                  <Text style={[s.userStreak, { color: colors.muted }]}>
                    {formatStreak(
                      user.isCurrentUser ? vm.streak : user.streak,
                    )}
                  </Text>
                </View>

                <View style={s.pointsColumn}>
                  <Text style={[s.userPoints, { color: colors.text }]}>
                    {user.points.toLocaleString()}
                  </Text>
                  <Text style={[s.pointsLabel, { color: colors.muted }]}>
                    pts
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Achievements summary */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>
            My Achievements
          </Text>
        </View>

        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: colors.card }]}>
            <Text style={s.statIcon}>⭐</Text>
            <Text style={[s.statValue, { color: colors.text }]}>
              {vm.totalPoints.toLocaleString()}
            </Text>
            <Text style={[s.statLabel, { color: colors.muted }]}>
              Total points
            </Text>
          </View>

          <View style={[s.statCard, { backgroundColor: colors.card }]}>
            <Text style={s.statIcon}>🏅</Text>
            <Text style={[s.statValue, { color: colors.text }]}>
              {vm.unlockedCount}/{vm.achievements.length}
            </Text>
            <Text style={[s.statLabel, { color: colors.muted }]}>
              Badges
            </Text>
          </View>

          <View style={[s.statCard, { backgroundColor: colors.card }]}>
            <Text style={s.statIcon}>🔥</Text>
            <Text style={[s.statValue, { color: colors.text }]}>
              {vm.streak}
            </Text>
            <Text style={[s.statLabel, { color: colors.muted }]}>
              Day streak
            </Text>
          </View>
        </View>

        {/* Level */}
        <View
          style={[
            s.levelCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.track,
            },
          ]}
        >
          <View style={s.levelHeader}>
            <Text style={s.levelBadge}>
              LEVEL {vm.levelInfo.level.level}
            </Text>
            <Text style={[s.levelTitle, { color: colors.text }]}>
              {vm.levelInfo.level.title}
            </Text>
            <Text style={[s.levelPoints, { color: colors.muted }]}>
              {vm.levelInfo.pointsLabel}
            </Text>
          </View>

          <View style={[s.levelTrack, { backgroundColor: colors.track }]}>
            <View
              style={[
                s.levelFill,
                {
                  width: `${vm.levelInfo.progress}%` as `${number}%`,
                },
              ]}
            />
          </View>

          <Text style={[s.levelHint, { color: colors.muted }]}>
            {vm.levelInfo.nextLevel
              ? `${vm.levelInfo.pointsToNextLevel.toLocaleString()} pts to Level ${
                  vm.levelInfo.nextLevel.level
                } · ${vm.levelInfo.nextLevel.title}`
              : 'You reached the highest level!'}
          </Text>
        </View>

        {/* Badges */}
        <View collapsable={false} onLayout={handleBadgesLayout}>
          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>
              Badges
            </Text>

            <View style={s.badgeHeaderActions}>
              <Text style={[s.mutedText, { color: colors.muted }]}>
                {vm.unlockedCount} of {vm.achievements.length} earned
              </Text>

              {vm.hasMoreAchievements ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={
                    vm.showAllAchievements
                      ? 'Show fewer badges'
                      : 'Show all badges'
                  }
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={
                    vm.showAllAchievements
                      ? handleShowLessBadges
                      : vm.toggleShowAllAchievements
                  }
                >
                  <Text style={s.seeAll}>
                    {vm.showAllAchievements ? 'Show less' : 'See all'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={s.badgesGrid}>
          {vm.visibleAchievements.map((achievement) => {
            const isSelected =
              vm.selectedAchievement?.id === achievement.id;

            return (
              <TouchableOpacity
                key={achievement.id}
                accessibilityRole="button"
                accessibilityLabel={`${achievement.title}: ${
                  achievement.unlocked
                    ? 'earned'
                    : `${achievement.progress}% complete`
                }`}
                accessibilityState={{ selected: isSelected }}
                activeOpacity={0.8}
                onPress={() => vm.toggleAchievement(achievement.id)}
                style={[
                  s.badgeCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.track,
                  },
                  isSelected && s.selectedBadgeCard,
                ]}
              >
                <View
                  style={[
                    s.badgeIcon,
                    { backgroundColor: colors.lime },
                    !achievement.unlocked && {
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <Text style={s.badgeEmoji}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                </View>

                <Text style={[s.badgeTitle, { color: colors.text }]}>
                  {achievement.title}
                </Text>
                <Text style={[s.badgeStatus, { color: colors.primary }]}>
                  {achievement.unlocked
                    ? 'Earned'
                    : `${achievement.progress}%`}
                </Text>

                {!achievement.unlocked && (
                  <View
                    style={[
                      s.badgeTrack,
                      { backgroundColor: colors.track },
                    ]}
                  >
                    <View
                      style={[
                        s.badgeFill,
                        {
                          width: `${achievement.progress}%` as `${number}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          </View>
        </View>

        {vm.selectedAchievement && (
          <View
            style={[
              s.achievementDetail,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary,
              },
            ]}
          >
            <View style={s.achievementDetailHeader}>
              <Text style={s.achievementDetailIcon}>
                {vm.selectedAchievement.icon}
              </Text>

              <View style={s.achievementDetailText}>
                <Text
                  style={[s.achievementDetailTitle, { color: colors.text }]}
                >
                  {vm.selectedAchievement.title}
                </Text>
                <Text
                  style={[
                    s.achievementDetailDescription,
                    { color: colors.muted },
                  ]}
                >
                  {vm.selectedAchievement.description}
                </Text>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close badge details"
                onPress={() => vm.toggleAchievement(vm.selectedAchievement!.id)}
              >
                <Text style={[s.closeText, { color: colors.muted }]}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={[s.achievementDetailStatus, { color: colors.primary }]}>
              {vm.selectedAchievement.unlocked
                ? 'Unlocked'
                : `${vm.selectedAchievement.progress}% complete`}
            </Text>
          </View>
        )}

        {/* Rewards */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>
            Rewards
          </Text>
          <Text style={[s.mutedText, { color: colors.muted }]}>
            {vm.availablePoints.toLocaleString()} pts available
          </Text>
        </View>

        {vm.redemptionMessage ? (
          <View
            accessibilityLiveRegion="polite"
            style={[
              s.messageBox,
              {
                backgroundColor:
                  vm.redemptionMessageType === 'error'
                    ? colors.background
                    : colors.lime,
                borderColor:
                  vm.redemptionMessageType === 'error'
                    ? '#FF6B6B'
                    : colors.lime,
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                s.messageText,
                {
                  color:
                    vm.redemptionMessageType === 'error'
                      ? '#FF6B6B'
                      : '#171326',
                },
              ]}
            >
              {vm.redemptionMessage}
            </Text>
          </View>
        ) : null}

        {vm.rewards.map((reward) => (
          <View
            key={reward.id}
            style={[s.rewardCard, { backgroundColor: colors.card }]}
          >
            <View style={[s.rewardIcon, { backgroundColor: colors.lime }]}>
              <Text style={s.rewardEmoji}>{reward.icon}</Text>
            </View>

            <View style={s.rewardInfo}>
              <Text style={[s.rewardTitle, { color: colors.text }]}>
                {reward.title}
              </Text>
              <Text
                style={[s.rewardDescription, { color: colors.muted }]}
              >
                {reward.description}
              </Text>
              <Text style={[s.rewardCost, { color: colors.muted }]}>
                {reward.cost.toLocaleString()} pts
              </Text>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                reward.redeemed
                  ? `${reward.title} already redeemed`
                  : reward.canRedeem
                    ? `Redeem ${reward.title}`
                    : `${reward.title} needs ${reward.pointsNeeded} more points`
              }
              accessibilityState={{ disabled: reward.redeemed }}
              disabled={reward.redeemed}
              onPress={() => vm.redeemReward(reward.id)}
              style={[
                s.redeemButton,
                {
                  backgroundColor: reward.redeemed
                    ? colors.track
                    : reward.canRedeem
                      ? colors.lime
                      : colors.background,
                },
              ]}
            >
              <Text
                style={[
                  s.redeemText,
                  {
                    color: reward.redeemed
                      ? colors.muted
                      : reward.canRedeem
                        ? '#171326'
                        : colors.muted,
                  },
                ]}
              >
                {reward.redeemed
                  ? 'Redeemed ✓'
                  : reward.canRedeem
                    ? 'Redeem'
                    : `${reward.pointsNeeded.toLocaleString()} to go`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom navigation */}
      <BottomNav
        colors={colors}
        activeScreen="Leaderboard"
        onNavigate={(screen) => onNavigate?.(screen)}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backText: {
      fontSize: 32,
      lineHeight: 36,
    },
    headerCenter: {
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
    },
    subtitle: {
      fontSize: 11,
      marginTop: 3,
    },
    headerIcon: {
      color: colors.primary,
      fontSize: 25,
    },
    demoNotice: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 9,
      marginBottom: 12,
    },
    demoNoticeText: {
      fontSize: 10,
      lineHeight: 15,
    },
    periodBar: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.track,
      borderRadius: 30,
      padding: 4,
      marginBottom: 12,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 24,
    },
    selectedPeriod: {
      backgroundColor: colors.primary,
    },
    periodText: {
      fontSize: 11,
      fontWeight: '600',
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginBottom: 24,
    },
    filter: {
      borderWidth: 1,
      borderRadius: 24,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    filterText: {
      fontSize: 10,
      fontWeight: '700',
    },
    emptyCard: {
      alignItems: 'center',
      borderRadius: 23,
      borderWidth: 1,
      paddingHorizontal: 24,
      paddingVertical: 30,
      marginBottom: 24,
    },
    emptyIcon: {
      fontSize: 38,
      marginBottom: 10,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '800',
      textAlign: 'center',
    },
    emptyMessage: {
      fontSize: 11,
      lineHeight: 17,
      textAlign: 'center',
      marginTop: 8,
    },
    emptyAction: {
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 11,
      marginTop: 16,
    },
    emptyActionText: {
      fontSize: 11,
      fontWeight: '800',
    },
    podium: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginBottom: 18,
    },
    podiumItem: {
      flex: 1,
      alignItems: 'center',
    },
    firstPlace: {
      marginHorizontal: 3,
    },
    crown: {
      fontSize: 25,
      marginBottom: 5,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 32,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 7,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarText: {
      fontSize: 17,
      fontWeight: '800',
    },
    podiumName: {
      fontSize: 12,
      fontWeight: '700',
    },
    podiumPoints: {
      fontSize: 10,
      marginTop: 2,
      marginBottom: 8,
    },
    podiumBlock: {
      width: '95%',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      alignItems: 'center',
      paddingTop: 12,
    },
    rankNumber: {
      color: '#FFFFFF',
      fontSize: 29,
      fontWeight: '900',
    },
    rankCard: {
      backgroundColor: colors.lime,
      padding: 15,
      borderRadius: 23,
      marginBottom: 28,
    },
    rankTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    youBadge: {
      backgroundColor: '#171326',
      width: 43,
      height: 43,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    youText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '900',
    },
    rankInfo: {
      flex: 1,
    },
    rankCaption: {
      color: '#302A40',
      fontSize: 10,
    },
    rankValue: {
      color: '#171326',
      fontSize: 17,
      fontWeight: '900',
      marginTop: 2,
    },
    rankChange: {
      color: '#FFFFFF',
      backgroundColor: '#171326',
      borderRadius: 18,
      overflow: 'hidden',
      paddingHorizontal: 9,
      paddingVertical: 7,
      fontSize: 10,
      fontWeight: '700',
    },
    progressTrack: {
      height: 7,
      backgroundColor: '#A9CE56',
      borderRadius: 6,
      marginTop: 13,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#171326',
      borderRadius: 6,
    },
    rankHint: {
      color: '#302A40',
      fontSize: 10,
      marginTop: 7,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      marginTop: 3,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
    },
    seeAll: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    mutedText: {
      fontSize: 11,
    },
    badgeHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.track,
      padding: 12,
      borderRadius: 20,
      marginBottom: 9,
      gap: 9,
    },
    currentUserRow: {
      borderWidth: 2,
      borderColor: colors.primary,
    },
    userRank: {
      width: 15,
      textAlign: 'center',
      fontWeight: '800',
    },
    smallAvatar: {
      width: 40,
      height: 40,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    smallAvatarText: {
      color: '#171326',
      fontSize: 12,
      fontWeight: '800',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 12,
      fontWeight: '700',
    },
    userStreak: {
      fontSize: 10,
      marginTop: 3,
    },
    pointsColumn: {
      alignItems: 'flex-end',
    },
    userPoints: {
      fontSize: 14,
      fontWeight: '800',
    },
    pointsLabel: {
      fontSize: 10,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 9,
      marginBottom: 13,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.track,
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 3,
    },
    statIcon: {
      fontSize: 22,
      marginBottom: 7,
    },
    statValue: {
      fontSize: 17,
      fontWeight: '900',
    },
    statLabel: {
      fontSize: 10,
      marginTop: 3,
    },
    levelCard: {
      borderRadius: 23,
      padding: 16,
      marginBottom: 25,
      borderWidth: 1,
    },
    levelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 9,
      marginBottom: 13,
    },
    levelBadge: {
      backgroundColor: colors.lime,
      color: '#171326',
      borderRadius: 14,
      paddingHorizontal: 9,
      paddingVertical: 5,
      fontSize: 10,
      fontWeight: '900',
      overflow: 'hidden',
    },
    levelTitle: {
      fontSize: 16,
      fontWeight: '800',
      flex: 1,
    },
    levelPoints: {
      fontSize: 10,
    },
    levelTrack: {
      height: 9,
      borderRadius: 8,
      overflow: 'hidden',
    },
    levelFill: {
      height: '100%',
      backgroundColor: colors.lime,
      borderRadius: 8,
    },
    levelHint: {
      fontSize: 10,
      marginTop: 9,
    },
    badgesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    badgeCard: {
      width: '31.5%',
      minHeight: 142,
      alignItems: 'center',
      borderRadius: 19,
      paddingHorizontal: 5,
      paddingVertical: 14,
      marginBottom: 10,
      borderWidth: 1,
    },
    selectedBadgeCard: {
      borderWidth: 2,
    },
    badgeIcon: {
      width: 43,
      height: 43,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    badgeEmoji: {
      fontSize: 20,
    },
    badgeTitle: {
      fontSize: 10,
      fontWeight: '800',
      textAlign: 'center',
    },
    badgeStatus: {
      fontSize: 10,
      marginTop: 7,
    },
    badgeTrack: {
      height: 5,
      width: '90%',
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 8,
    },
    badgeFill: {
      height: '100%',
    },
    achievementDetail: {
      borderRadius: 18,
      borderWidth: 1,
      padding: 13,
      marginBottom: 25,
    },
    achievementDetailHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    achievementDetailIcon: {
      fontSize: 28,
    },
    achievementDetailText: {
      flex: 1,
    },
    achievementDetailTitle: {
      fontSize: 13,
      fontWeight: '800',
    },
    achievementDetailDescription: {
      fontSize: 11,
      lineHeight: 16,
      marginTop: 4,
    },
    achievementDetailStatus: {
      fontSize: 11,
      fontWeight: '700',
      marginTop: 10,
    },
    closeText: {
      fontSize: 24,
      lineHeight: 26,
      paddingHorizontal: 2,
    },
    messageBox: {
      borderRadius: 14,
      paddingHorizontal: 13,
      paddingVertical: 10,
      marginBottom: 12,
    },
    messageText: {
      color: '#171326',
      fontSize: 11,
      fontWeight: '700',
    },
    rewardCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.track,
      padding: 13,
      borderRadius: 20,
      marginBottom: 10,
      gap: 10,
    },
    rewardIcon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardEmoji: {
      fontSize: 22,
    },
    rewardInfo: {
      flex: 1,
    },
    rewardTitle: {
      fontSize: 12,
      fontWeight: '800',
    },
    rewardDescription: {
      fontSize: 10,
      marginTop: 3,
    },
    rewardCost: {
      fontSize: 10,
      marginTop: 4,
    },
    redeemButton: {
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    redeemText: {
      fontSize: 10,
      fontWeight: '800',
    },
  });
}
