import { useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';

import { getActivityData } from '../models/ActivityModel';
import {
  achievements,
  leaderboardFilters,
  leaderboardUsers,
  levelTiers,
  rankingPeriods,
  rewards,
  thirtyDayChallengeId,
  type Achievement,
  type LeaderboardEntry,
  type LeaderboardFilter,
  type LeaderboardUser,
  type LevelTier,
  type RankingPeriod,
  type Reward,
} from '../models/LeaderboardModel';

export interface RewardState extends Reward {
  redeemed: boolean;
  canRedeem: boolean;
  pointsNeeded: number;
}

export interface LeaderboardEmptyState {
  title: string;
  message: string;
  actionLabel: string;
}

export interface LeaderboardFriendProfile {
  username: string;
  name: string;
  initials: string;
  color: string;
  avatar?: ImageSourcePropType;
  points?: number;
  streak?: number;
}

export interface LeaderboardViewModelOptions {
  currentUserName?: string;
  currentUserUsername?: string;
  currentUserInitials?: string;
  friends?: LeaderboardFriendProfile[];
}

export type RedemptionMessageType = 'info' | 'success' | 'error';

function normalizeUsername(username?: string): string {
  return (username ?? '').trim().replace(/^@/, '').toLowerCase();
}

function getLevelInfo(totalPoints: number): {
  level: LevelTier;
  nextLevel?: LevelTier;
  progress: number;
  pointsToNextLevel: number;
  pointsLabel: string;
} {
  let level = levelTiers[0];

  for (const tier of levelTiers) {
    if (totalPoints >= tier.minPoints) {
      level = tier;
    }
  }

  const nextLevel = levelTiers.find(
    (tier) => tier.minPoints > level.minPoints,
  );

  const progress = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((totalPoints - level.minPoints) /
            (nextLevel.minPoints - level.minPoints)) *
            100,
        ),
      )
    : 100;

  return {
    level,
    nextLevel,
    progress,
    pointsToNextLevel: nextLevel
      ? Math.max(0, nextLevel.minPoints - totalPoints)
      : 0,
    pointsLabel: nextLevel
      ? `${totalPoints.toLocaleString()} / ${nextLevel.minPoints.toLocaleString()}`
      : `${totalPoints.toLocaleString()} pts`,
  };
}

export default function useLeaderboardViewModel({
  currentUserName,
  currentUserUsername,
  currentUserInitials,
  friends,
}: LeaderboardViewModelOptions = {}) {
  const [period, setPeriod] = useState<RankingPeriod>('Weekly');
  const [filter, setFilter] = useState<LeaderboardFilter>('Everyone');
  const [showAllRankings, setShowAllRankings] = useState<boolean>(false);
  const [showAllAchievements, setShowAllAchievements] =
    useState<boolean>(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState<
    string | null
  >(null);

  const friendUsernameSet = useMemo(
    () =>
      new Set(
        (friends ?? [])
          .map((friend) => normalizeUsername(friend.username))
          .filter(Boolean),
      ),
    [friends],
  );

  const friendOnlyUsers = useMemo<LeaderboardUser[]>(() => {
    const sampleUsernames = new Set(
      leaderboardUsers.map((user) => normalizeUsername(user.username)),
    );

    return (friends ?? [])
      .map((friend) => ({
        ...friend,
        username: normalizeUsername(friend.username),
      }))
      .filter(
        (friend) =>
          friend.username && !sampleUsernames.has(friend.username),
      )
      .map((friend) => ({
        id: `friend-${friend.username}`,
        name: friend.name.trim() || `@${friend.username}`,
        username: friend.username,
        initials:
          friend.initials.trim() ||
          friend.username.slice(0, 2).toUpperCase(),
        avatarColor: friend.color,
        avatar: friend.avatar,
        totalPoints: friend.points ?? 0,
        pointsByPeriod: {
          Weekly: 0,
          Monthly: 0,
          'All Time': friend.points ?? 0,
        },
        activeChallengeIds: [],
        streak: friend.streak ?? 0,
      }));
  }, [friends]);

  const resolvedLeaderboardUsers = useMemo<LeaderboardUser[]>(
    () =>
      leaderboardUsers.map((user) =>
        user.isCurrentUser
          ? {
              ...user,
              name: currentUserName?.trim() || user.name,
              username:
                normalizeUsername(currentUserUsername) || user.username,
              initials: currentUserInitials?.trim() || user.initials,
            }
          : user,
      ),
    [currentUserName, currentUserUsername, currentUserInitials],
  );

  const currentUserData = resolvedLeaderboardUsers.find(
    (user) => user.isCurrentUser,
  );

  const [wallet, setWallet] = useState<{
    points: number;
    redeemedRewards: string[];
    message: string;
    messageType: RedemptionMessageType;
  }>({
    points: currentUserData?.totalPoints ?? 0,
    redeemedRewards: [],
    message: '',
    messageType: 'info',
  });

  const filteredLeaderboardUsers = useMemo<LeaderboardUser[]>(() => {
    if (filter === 'Friends') {
      const friendRankedUsers = [
        ...resolvedLeaderboardUsers,
        ...friendOnlyUsers,
      ];

      const friendMatches = friendRankedUsers.filter(
        (user) =>
          !user.isCurrentUser &&
          friendUsernameSet.has(normalizeUsername(user.username)),
      );

      if (friendMatches.length === 0) {
        return [];
      }

      return friendRankedUsers.filter(
        (user) =>
          user.isCurrentUser ||
          friendUsernameSet.has(normalizeUsername(user.username)),
      );
    }

    if (filter === '30-Day Challenge') {
      return resolvedLeaderboardUsers.filter((user) =>
        user.activeChallengeIds.includes(thirtyDayChallengeId),
      );
    }

    return resolvedLeaderboardUsers;
  }, [
    filter,
    resolvedLeaderboardUsers,
    friendOnlyUsers,
    friendUsernameSet,
  ]);

  const users = useMemo<LeaderboardEntry[]>(() => {
    return [...filteredLeaderboardUsers]
      .map((user) => ({
        ...user,
        points: user.pointsByPeriod[period],
        rank: 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [period, filteredLeaderboardUsers]);

  const currentUser = users.find((user) => user.isCurrentUser);
  const currentRank = currentUser?.rank ?? 0;
  const nextRankUser =
    currentUser && currentRank > 1 ? users[currentRank - 2] : undefined;

  const rankProgress =
    currentUser && nextRankUser && nextRankUser.points > 0
      ? Math.min(
          100,
          Math.round((currentUser.points / nextRankUser.points) * 100),
        )
      : 100;

  const pointsToNextRank = nextRankUser
    ? Math.max(0, nextRankUser.points - (currentUser?.points ?? 0))
    : 0;

  const periodLabel =
    period === 'Weekly'
      ? 'this week'
      : period === 'Monthly'
        ? 'this month'
        : 'all time';

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked,
  ).length;

  const totalPoints = currentUserData?.totalPoints ?? 0;
  const levelInfo = getLevelInfo(totalPoints);

  const streak = useMemo(() => getActivityData().streak, []);

  const rewardStates = useMemo<RewardState[]>(
    () =>
      rewards.map((reward) => {
        const redeemed = wallet.redeemedRewards.includes(reward.id);
        const pointsNeeded = Math.max(0, reward.cost - wallet.points);

        return {
          ...reward,
          redeemed,
          canRedeem: !redeemed && wallet.points >= reward.cost,
          pointsNeeded,
        };
      }),
    [wallet],
  );

  const hasMoreRankings = users.length > 6;
  const hasMoreAchievements = achievements.length > 3;

  const visibleRankings = showAllRankings
    ? users.slice(3)
    : users.slice(3, 6);

  const visibleAchievements: Achievement[] = showAllAchievements
    ? achievements
    : achievements.slice(0, 3);

  const selectedAchievement =
    achievements.find(
      (achievement) => achievement.id === selectedAchievementId,
    ) ?? null;

  const emptyState: LeaderboardEmptyState | null =
    users.length > 0
      ? null
      : filter === 'Friends'
        ? {
            title: 'No friends to rank yet',
            message:
              'Accept a friend request or add a friend to see how you compare. Friend rankings appear as soon as you have at least one connection.',
            actionLabel: 'Show everyone',
          }
        : filter === '30-Day Challenge'
          ? {
              title: 'No 30-day rankings yet',
              message:
                'None of the sample profiles are in the 30-Day Strength Challenge. Browse challenges to find a program to join.',
              actionLabel: 'Browse challenges',
            }
          : {
              title: 'No rankings available',
              message:
                'There are no profiles to rank right now. Try another period or come back later.',
              actionLabel: 'Show everyone',
            };

  const changeFilter = (nextFilter: LeaderboardFilter): void => {
    setFilter(nextFilter);
    setShowAllRankings(false);
  };

  const redeemReward = (rewardId: string): void => {
    const reward = rewards.find((item) => item.id === rewardId);

    if (!reward) {
      return;
    }

    setWallet((current) => {
      if (current.redeemedRewards.includes(rewardId)) {
        return {
          ...current,
          message: 'You already redeemed this reward.',
          messageType: 'info',
        };
      }

      if (current.points < reward.cost) {
        return {
          ...current,
          message: `You need ${(
            reward.cost - current.points
          ).toLocaleString()} more points to redeem this reward.`,
          messageType: 'error',
        };
      }

      return {
        points: current.points - reward.cost,
        redeemedRewards: [...current.redeemedRewards, rewardId],
        message: `${reward.title} redeemed locally. ${(
          current.points - reward.cost
        ).toLocaleString()} points remain available.`,
        messageType: 'success',
      };
    });
  };

  const toggleAchievement = (achievementId: string): void => {
    setSelectedAchievementId((current) =>
      current === achievementId ? null : achievementId,
    );
  };

  const toggleShowAllAchievements = (): void => {
    if (showAllAchievements) {
      setSelectedAchievementId(null);
    }

    setShowAllAchievements((current) => !current);
  };

  return {
    periods: rankingPeriods,
    filters: leaderboardFilters,
    period,
    setPeriod,
    filter,
    setFilter: changeFilter,
    emptyState,
    users,
    podium: users.slice(0, 3),
    visibleRankings,
    hasMoreRankings,
    showAllRankings,
    toggleShowAllRankings: (): void =>
      setShowAllRankings((current) => !current),
    currentUser,
    currentRank,
    nextRankUser,
    rankProgress,
    pointsToNextRank,
    periodLabel,
    achievements,
    visibleAchievements,
    hasMoreAchievements,
    showAllAchievements,
    toggleShowAllAchievements,
    selectedAchievement,
    toggleAchievement,
    unlockedCount,
    streak,
    levelInfo,
    totalPoints,
    availablePoints: wallet.points,
    rewards: rewardStates,
    redeemReward,
    redemptionMessage: wallet.message,
    redemptionMessageType: wallet.messageType,
  };
}

export type LeaderboardViewModel = ReturnType<
  typeof useLeaderboardViewModel
>;
