import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import BrandHeader from '../components/BrandHeader';
import BottomNav from '../components/BottomNav';
import type { ActivityData, Challenge } from '../models/ActivityModel';
import type {
  Achievement,
  LevelTier,
} from '../models/LeaderboardModel';
import type { ProfileTextField } from '../models/ProfileModel';
import type { Colors } from '../theme/Color';
import useProfileViewModel, {
  type FeedbackMessage,
} from '../viewmodels/ProfileViewModel';

interface ProfileLevelInfo {
  level: LevelTier;
  progress: number;
  pointsLabel: string;
  pointsToNextLevel: number;
  nextLevel?: LevelTier;
}

interface ProfileScreenProps {
  colors: Colors;
  darkMode: boolean;
  activity: ActivityData;
  activeChallenges: Challenge[];
  achievements: Achievement[];
  levelInfo: ProfileLevelInfo;
  unlockedAchievements: number;
  totalAchievements: number;
  totalPoints: number;
  vm: ReturnType<typeof useProfileViewModel>;
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onToggleTheme: () => void;
}

interface QuickLink {
  icon: string;
  label: string;
  description: string;
  screen: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    icon: '⚑',
    label: 'Browse Challenges',
    description: 'Find your next challenge',
    screen: 'Challenges',
  },
  {
    icon: '▥',
    label: 'Leaderboard',
    description: 'See your ranking and badges',
    screen: 'Leaderboard',
  },
  {
    icon: '◉',
    label: 'Friends',
    description: 'Connect and compete together',
    screen: 'Friends',
  },
  {
    icon: '＋',
    label: 'Record a Workout',
    description: 'Log today’s activity',
    screen: 'Record Workout',
  },
];

interface ProfileAvatarProps {
  avatar?: ImageSourcePropType;
  initials: string;
  name: string;
  color: string;
  borderColor: string;
}

function ProfileAvatar({
  avatar,
  initials,
  name,
  color,
  borderColor,
}: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(avatar) && !failed;

  return (
    <View
      accessible
      accessibilityLabel={`${name} ${showPhoto ? 'profile photo' : 'avatar'}`}
      style={[
        styles.avatar,
        { backgroundColor: color, borderColor },
      ]}
    >
      {showPhoto ? (
        <Image
          source={avatar}
          style={styles.avatarImage}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={styles.avatarText}>{initials}</Text>
      )}
    </View>
  );
}

export default function ProfileScreen({
  colors,
  darkMode,
  activity,
  activeChallenges,
  achievements,
  levelInfo,
  unlockedAchievements,
  totalAchievements,
  totalPoints,
  vm,
  onBack,
  onNavigate,
  onToggleTheme,
}: ProfileScreenProps) {
  const initialized = useRef(false);
  const resetTransientState = vm.resetTransientState;

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    resetTransientState();
  }, [resetTransientState]);

  const goalAccentColors = [colors.primary, colors.lavender, colors.lime];
  const achievementPreview = achievements.slice(0, 4);

  const inputStyle = {
    color: colors.text,
    backgroundColor: colors.background,
  };

  const renderInputField = (
    label: string,
    field: ProfileTextField,
    value: string,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    autoCapitalize: 'none' | 'sentences' | 'words' = 'sentences',
  ) => {
    const error = vm.profileErrors[field];

    return (
      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.muted }]}>
          {label}
        </Text>

        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={(text) => vm.updateDraftField(field, text)}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={[
            styles.input,
            inputStyle,
            { borderColor: error ? '#FF6B6B' : colors.track },
          ]}
        />

        {error ? (
          <Text style={styles.fieldError}>{error}</Text>
        ) : null}
      </View>
    );
  };

  const renderInfoRow = (label: string, value: string) => (
    <View style={[styles.infoRow, { borderBottomColor: colors.track }]}>
      <Text style={[styles.infoLabel, { color: colors.muted }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>
        {value.trim().length > 0 ? value : 'Not set'}
      </Text>
    </View>
  );

  const renderChip = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      key={label}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.background,
          borderColor: selected ? colors.primary : colors.track,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: selected ? '#FFFFFF' : colors.text },
        ]}
      >
        {selected ? '✓  ' : '+  '}
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFeedback = (feedback: FeedbackMessage | null) => {
    if (!feedback) {
      return null;
    }

    const isSuccess = feedback.type === 'success';

    return (
      <View
        style={[
          styles.feedback,
          {
            backgroundColor: isSuccess ? colors.lime : colors.card,
            borderColor: isSuccess ? colors.lime : '#FF6B6B',
          },
        ]}
      >
        <Text
          style={[
            styles.feedbackText,
            { color: isSuccess ? '#171326' : '#FF6B6B' },
          ]}
        >
          {feedback.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content}
      >
        <BrandHeader />
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.75}
            onPress={onBack}
            style={[styles.roundButton, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.headerIcon, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.eyebrow, { color: colors.lavender }]}>
              FITNESS PROFILE
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Profile
            </Text>
          </View>

          <View
            style={[
              styles.headerStreakPill,
              { backgroundColor: colors.card, borderColor: colors.track },
            ]}
          >
            <Text style={styles.headerStreakIcon}>🔥</Text>
            <Text
              style={[styles.headerStreakText, { color: colors.text }]}
            >
              {activity.streak}d
            </Text>
          </View>
        </View>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Progress, goals, and preferences in one place.
        </Text>

        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <View style={styles.heroInfo}>
            <ProfileAvatar
              avatar={vm.avatar}
              initials={vm.initials}
              name={vm.profile.fullName}
              color={vm.avatarColor}
              borderColor={colors.lime}
            />

            <View style={styles.heroDetails}>
              <Text numberOfLines={1} style={styles.heroName}>
                {vm.profile.fullName}
              </Text>
              <Text numberOfLines={1} style={styles.heroUsername}>
                @{vm.profile.username}
              </Text>
              <View
                style={[
                  styles.heroBadge,
                  { backgroundColor: colors.lime },
                ]}
              >
                <Text style={styles.heroBadgeText}>
                  LEVEL {levelInfo.level.level} ·{' '}
                  {levelInfo.level.title.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.levelProgressBlock}>
            <View style={styles.levelProgressHeader}>
              <Text style={styles.levelProgressLabel}>Level progress</Text>
              <Text style={styles.levelProgressValue}>
                {levelInfo.pointsLabel}
              </Text>
            </View>

            <View style={styles.levelTrack}>
              <View
                style={[
                  styles.levelFill,
                  {
                    width: `${Math.min(100, levelInfo.progress)}%`,
                    backgroundColor: colors.lime,
                  },
                ]}
              />
            </View>

            <Text style={styles.levelHint}>
              {levelInfo.nextLevel
                ? `${levelInfo.pointsToNextLevel.toLocaleString()} pts to Level ${levelInfo.nextLevel.level}`
                : 'Top level reached'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Profile Information
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Your basic details and contact information.
            </Text>
          </View>

          {!vm.isEditingProfile ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              activeOpacity={0.8}
              onPress={vm.startEditingProfile}
              style={[
                styles.editButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.editButtonText, { color: colors.lime }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {vm.isEditingProfile ? (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.track },
            ]}
          >
            {renderInputField(
              'Full name',
              'fullName',
              vm.draftProfile.fullName,
              'Enter your full name',
            )}

            {renderInputField(
              'Username',
              'username',
              vm.draftProfile.username,
              'Enter a username',
              'default',
              'none',
            )}

            {renderInputField(
              'Email',
              'email',
              vm.draftProfile.email,
              'Enter your email address',
              'email-address',
              'none',
            )}

            <View style={styles.ageField}>
              {renderInputField(
                'Age (optional)',
                'age',
                vm.draftProfile.age,
                'e.g. 22',
                'numeric',
                'none',
              )}
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>
                Gender (optional)
              </Text>

              <View style={styles.chips}>
                {vm.genderOptions.map((gender) =>
                  renderChip(
                    gender,
                    vm.draftProfile.gender === gender,
                    () =>
                      vm.updateDraftProfile({
                        gender:
                          vm.draftProfile.gender === gender ? '' : gender,
                      }),
                  ),
                )}
              </View>
            </View>

            {renderFeedback(vm.profileFeedback)}

            <View style={styles.actionRow}>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={vm.cancelEditingProfile}
                style={[
                  styles.secondaryButton,
                  { borderColor: colors.track },
                ]}
              >
                <Text
                  style={[styles.secondaryButtonText, { color: colors.text }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={vm.saveProfile}
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[styles.primaryButtonText, { color: colors.lime }]}
                >
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.track },
            ]}
          >
            {renderInfoRow('Full name', vm.profile.fullName)}
            {renderInfoRow('Username', `@${vm.profile.username}`)}
            {renderInfoRow('Email', vm.profile.email)}
            {renderInfoRow('Age', vm.profile.age)}
            {renderInfoRow('Gender', vm.profile.gender)}

            {renderFeedback(vm.profileFeedback)}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Fitness Snapshot
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Your progress at a glance.
            </Text>
          </View>
        </View>

        <View style={styles.snapshotGrid}>
          {[
            {
              icon: '🔥',
              value: `${activity.streak}d`,
              label: 'Day streak',
            },
            {
              icon: '★',
              value: totalPoints.toLocaleString(),
              label: 'Total points',
            },
            {
              icon: '◷',
              value: `${activity.workoutMinutes}m`,
              label: 'Active today',
            },
            {
              icon: '⚑',
              value: `${activeChallenges.length}`,
              label: 'Active challenges',
            },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                styles.snapshotCard,
                { backgroundColor: colors.card, borderColor: colors.track },
              ]}
            >
              <View
                style={[
                  styles.snapshotIcon,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.snapshotIconText,
                    { color: colors.lime },
                  ]}
                >
                  {item.icon}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[styles.snapshotValue, { color: colors.text }]}
              >
                {item.value}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.snapshotLabel, { color: colors.muted }]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              My Fitness Goals
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Targets based on today’s activity.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open fitness goals"
            activeOpacity={0.8}
            onPress={() => onNavigate('My Goals')}
            style={[styles.compactAction, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.compactActionText, { color: colors.lime }]}>
              + Log
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            styles.goalsCard,
            { backgroundColor: colors.card, borderColor: colors.track },
          ]}
        >
          {vm.fitnessGoals.map((goal, index) => (
            <View
              key={goal.id}
              style={[
                styles.goalRow,
                index > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.track,
                },
              ]}
            >
              <View style={styles.goalTopRow}>
                <View
                  style={[
                    styles.goalIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Text style={styles.goalIconText}>{goal.icon}</Text>
                </View>

                <View style={styles.goalCopy}>
                  <Text
                    style={[styles.goalLabel, { color: colors.text }]}
                  >
                    {goal.label}
                  </Text>
                  <Text
                    style={[styles.goalValue, { color: colors.text }]}
                  >
                    {goal.currentLabel}
                    <Text style={{ color: colors.muted }}>
                      {' '}
                      of {goal.targetLabel}
                    </Text>
                  </Text>
                </View>

                <Text
                  style={[
                    styles.goalPercent,
                    {
                      color:
                        goalAccentColors[index % goalAccentColors.length],
                    },
                  ]}
                >
                  {goal.progress}%
                </Text>
              </View>

              <View
                style={[
                  styles.goalTrack,
                  { backgroundColor: colors.background },
                ]}
              >
                <View
                  style={[
                    styles.goalFill,
                    {
                      width: `${goal.progress}%`,
                      backgroundColor:
                        goalAccentColors[index % goalAccentColors.length],
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Activity Highlights
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Today’s activity and what you are working toward.
            </Text>
          </View>

        </View>

        <View
          style={[
            styles.highlightCard,
            { backgroundColor: colors.card, borderColor: colors.track },
          ]}
        >
          <View
            style={[
              styles.highlightIcon,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={styles.highlightIconText}>🏃</Text>
          </View>

          <View style={styles.highlightCopy}>
            <Text style={[styles.highlightCaption, { color: colors.lavender }]}>
              TODAY’S ACTIVITY
            </Text>
            <Text style={[styles.highlightTitle, { color: colors.text }]}>
              {activity.activityLabel}
            </Text>
            <Text style={[styles.highlightMeta, { color: colors.muted }]}>
              {activity.steps.toLocaleString()} steps · {activity.calories}{' '}
              kcal
            </Text>
          </View>
        </View>

        {activeChallenges.slice(0, 2).map((challenge) => (
          <TouchableOpacity
            key={challenge.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${challenge.title}`}
            activeOpacity={0.78}
            onPress={() => onNavigate('Challenges')}
            style={[
              styles.highlightCard,
              { backgroundColor: colors.card, borderColor: colors.track },
            ]}
          >
            <View
              style={[
                styles.highlightIcon,
                { backgroundColor: colors.lime },
              ]}
            >
              <Text style={styles.highlightIconText}>{challenge.icon}</Text>
            </View>

            <View style={styles.highlightCopy}>
              <Text
                style={[styles.highlightCaption, { color: colors.lavender }]}
              >
                ACTIVE CHALLENGE
              </Text>
              <Text style={[styles.highlightTitle, { color: colors.text }]}>
                {challenge.title}
              </Text>
              <Text style={[styles.highlightMeta, { color: colors.muted }]}>
                Day {challenge.day} of {challenge.totalDays} ·{' '}
                {challenge.reward} pts
              </Text>

              <View
                style={[
                  styles.highlightTrack,
                  { backgroundColor: colors.background },
                ]}
              >
                <View
                  style={[
                    styles.highlightFill,
                    {
                      width: `${challenge.progress}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={[styles.highlightChevron, { color: colors.muted }]}>
              ›
            </Text>
          </TouchableOpacity>
        ))}

        {activeChallenges.length === 0 ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Browse challenges"
            activeOpacity={0.78}
            onPress={() => onNavigate('Challenges')}
            style={[
              styles.highlightCard,
              { backgroundColor: colors.card, borderColor: colors.track },
            ]}
          >
            <View
              style={[
                styles.highlightIcon,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={styles.highlightIconText}>⚑</Text>
            </View>

            <View style={styles.highlightCopy}>
              <Text style={[styles.highlightTitle, { color: colors.text }]}>
                No active challenge
              </Text>
              <Text style={[styles.highlightMeta, { color: colors.muted }]}>
                Browse challenges to start your next streak.
              </Text>
            </View>

            <Text style={[styles.highlightChevron, { color: colors.muted }]}>
              ›
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Achievements
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Milestones you have unlocked.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="View all achievements"
            activeOpacity={0.75}
            onPress={() => onNavigate('Leaderboard')}
          >
            <Text style={[styles.sectionAction, { color: colors.lavender }]}>
              View all
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            styles.achievementsCard,
            { backgroundColor: colors.card, borderColor: colors.track },
          ]}
        >
          <View style={styles.achievementsSummary}>
            <View style={styles.achievementsSummaryCopy}>
              <Text
                style={[styles.achievementsValue, { color: colors.text }]}
              >
                {unlockedAchievements}/{totalAchievements}
              </Text>
              <Text
                style={[styles.achievementsLabel, { color: colors.muted }]}
              >
                badges earned
              </Text>
            </View>

            <View
              style={[
                styles.achievementsTrack,
                { backgroundColor: colors.background },
              ]}
            >
              <View
                style={[
                  styles.achievementsFill,
                  {
                    width: `${
                      totalAchievements > 0
                        ? Math.round(
                            (unlockedAchievements / totalAchievements) * 100,
                          )
                        : 0
                    }%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          {achievementPreview.length > 0 ? (
            <View style={styles.achievementGrid}>
              {achievementPreview.map((achievement) => (
                <View key={achievement.id} style={styles.achievementTile}>
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor: achievement.unlocked
                          ? colors.lime
                          : colors.background,
                        borderColor: achievement.unlocked
                          ? colors.lime
                          : colors.track,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.achievementIconText,
                        !achievement.unlocked && styles.achievementLocked,
                      ]}
                    >
                      {achievement.icon}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.achievementTitle,
                      {
                        color: achievement.unlocked
                          ? colors.text
                          : colors.muted,
                      },
                    ]}
                  >
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.achievementsEmpty, { color: colors.muted }]}>
              Complete your first challenge to earn a badge.
            </Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Fitness Preferences
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Pick the activities and challenges you enjoy most.
            </Text>
          </View>

          {vm.hasPreferenceChanges ? (
            <View
              style={[
                styles.unsavedBadge,
                { backgroundColor: colors.card, borderColor: colors.track },
              ]}
            >
              <View
                style={[styles.noteDot, { backgroundColor: colors.lavender }]}
              />
              <Text
                style={[styles.unsavedBadgeText, { color: colors.lavender }]}
              >
                UNSAVED
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.unsavedBadge,
                { backgroundColor: colors.card, borderColor: colors.track },
              ]}
            >
              <View
                style={[styles.noteDot, { backgroundColor: colors.lime }]}
              />
              <Text
                style={[styles.unsavedBadgeText, { color: colors.lime }]}
              >
                SAVED
              </Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.track },
          ]}
        >
          <Text style={[styles.preferenceTitle, { color: colors.text }]}>
            Preferred activities
          </Text>
          <Text style={[styles.preferenceHint, { color: colors.muted }]}>
            Select all that apply.
          </Text>

          <View style={styles.chips}>
            {vm.activityOptions.map((activityOption) =>
              renderChip(
                activityOption,
                vm.selectedActivities.includes(activityOption),
                () => vm.toggleActivity(activityOption),
              ),
            )}
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.track }]}
          />

          <Text style={[styles.preferenceTitle, { color: colors.text }]}>
            Challenge types
          </Text>
          <Text style={[styles.preferenceHint, { color: colors.muted }]}>
            Choose the formats that keep you motivated.
          </Text>

          <View style={styles.chips}>
            {vm.challengeTypeOptions.map((challengeTypeOption) =>
              renderChip(
                challengeTypeOption,
                vm.selectedChallengeTypes.includes(challengeTypeOption),
                () => vm.toggleChallengeType(challengeTypeOption),
              ),
            )}
          </View>

          {renderFeedback(vm.preferencesFeedback)}

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Save preferences"
            accessibilityState={{ disabled: !vm.hasPreferenceChanges }}
            activeOpacity={0.8}
            disabled={!vm.hasPreferenceChanges}
            onPress={vm.savePreferences}
            style={[
              styles.primaryButton,
              styles.fullWidthButton,
              { backgroundColor: colors.primary },
              !vm.hasPreferenceChanges && styles.buttonDisabled,
            ]}
          >
            <Text
              style={[styles.primaryButtonText, { color: colors.lime }]}
            >
              Save Preferences
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            styles.standaloneTitle,
            { color: colors.text },
          ]}
        >
          Account
        </Text>

        <View
          style={[
            styles.card,
            styles.settingsCard,
            { backgroundColor: colors.card, borderColor: colors.track },
          ]}
        >
          <View style={styles.settingRow}>
            <View
              style={[
                styles.settingIcon,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.settingIconText, { color: colors.primary }]}>
                {darkMode ? '☾' : '☀'}
              </Text>
            </View>

            <View style={styles.settingCopy}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Appearance
              </Text>
              <Text style={[styles.settingHint, { color: colors.muted }]}>
                {darkMode ? 'Dark mode is on' : 'Light mode is on'}
              </Text>
            </View>

            <Switch
              accessibilityLabel="Dark mode"
              value={darkMode}
              onValueChange={onToggleTheme}
              trackColor={{ false: colors.track, true: colors.primary }}
              thumbColor={darkMode ? colors.lime : '#FFFFFF'}
              ios_backgroundColor={colors.track}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Explore
            </Text>
            <Text style={[styles.sectionHint, { color: colors.muted }]}>
              Jump into the parts of the app you use most.
            </Text>
          </View>
        </View>

        <View style={styles.linkGrid}>
          {QUICK_LINKS.map((link) => (
            <TouchableOpacity
              key={link.screen}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              activeOpacity={0.78}
              onPress={() => onNavigate(link.screen)}
              style={[
                styles.linkCard,
                { backgroundColor: colors.card, borderColor: colors.track },
              ]}
            >
              <View
                style={[
                  styles.linkIcon,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[styles.linkIconText, { color: colors.primary }]}
                >
                  {link.icon}
                </Text>
              </View>

              <Text style={[styles.linkTitle, { color: colors.text }]}>
                {link.label}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.linkHint, { color: colors.muted }]}
              >
                {link.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNav
        colors={colors}
        activeScreen="Profile"
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
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 27,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 26,
  },
  headerStreakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  headerStreakIcon: {
    fontSize: 12,
  },
  headerStreakText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
    marginBottom: 18,
  },
  heroCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 24,
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingBottom: 14,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 39,
  },
  avatarText: {
    color: '#171326',
    fontSize: 25,
    fontWeight: '900',
  },
  heroDetails: {
    flex: 1,
    gap: 3,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  heroUsername: {
    color: '#F0EAFE',
    fontSize: 13,
    fontWeight: '600',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 5,
  },
  heroBadgeText: {
    color: '#171326',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  levelProgressBlock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    paddingTop: 13,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  levelProgressLabel: {
    color: '#F0EAFE',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  levelProgressValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  levelTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    overflow: 'hidden',
    marginTop: 8,
  },
  levelFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelHint: {
    color: '#F0EAFE',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  sectionHeaderSpaced: {
    marginTop: 14,
  },
  sectionHeading: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  standaloneTitle: {
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  editButton: {
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 11,
    fontWeight: '900',
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '800',
    paddingVertical: 3,
  },
  compactAction: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactActionText: {
    fontSize: 11,
    fontWeight: '900',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 26,
  },
  infoCard: {
    paddingBottom: 12,
  },
  infoRow: {
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  snapshotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  snapshotCard: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  snapshotIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  snapshotIconText: {
    fontSize: 16,
  },
  snapshotValue: {
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
  },
  snapshotLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 2,
  },
  goalsCard: {
    paddingVertical: 2,
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  goalRow: {
    paddingVertical: 12,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIconText: {
    fontSize: 16,
  },
  goalCopy: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  goalValue: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    marginTop: 2,
  },
  goalPercent: {
    fontSize: 12,
    fontWeight: '900',
  },
  goalTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 9,
    marginLeft: 46,
  },
  goalFill: {
    height: '100%',
    borderRadius: 3,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightIconText: {
    fontSize: 20,
  },
  highlightCopy: {
    flex: 1,
  },
  highlightCaption: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  highlightMeta: {
    fontSize: 10.5,
    fontWeight: '600',
    lineHeight: 15,
    marginTop: 3,
  },
  highlightTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 7,
  },
  highlightFill: {
    height: '100%',
    borderRadius: 3,
  },
  highlightChevron: {
    fontSize: 21,
    fontWeight: '700',
  },
  achievementsCard: {
    padding: 14,
    marginBottom: 24,
  },
  achievementsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 14,
  },
  achievementsSummaryCopy: {
    minWidth: 64,
  },
  achievementsValue: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 21,
  },
  achievementsLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 1,
  },
  achievementsTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  achievementsFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  achievementTile: {
    width: '23%',
    alignItems: 'center',
    gap: 6,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconText: {
    fontSize: 19,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    lineHeight: 13,
    textAlign: 'center',
  },
  achievementsEmpty: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingVertical: 10,
  },
  noteDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 5,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },
  input: {
    minHeight: 49,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 14,
  },
  fieldError: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    marginTop: 5,
  },
  ageField: {
    maxWidth: 150,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1.5,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  fullWidthButton: {
    flex: 0,
    alignSelf: 'stretch',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  feedback: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
    marginBottom: 14,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  unsavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  unsavedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  preferenceHint: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
    marginBottom: 11,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 18,
  },
  settingsCard: {
    paddingVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconText: {
    fontSize: 19,
    fontWeight: '800',
  },
  settingCopy: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  settingHint: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  linkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  linkCard: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 118,
    borderWidth: 1,
    borderRadius: 18,
    padding: 13,
  },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  linkIconText: {
    fontSize: 18,
    fontWeight: '800',
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 17,
  },
  linkHint: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  bottomSpacer: {
    height: 24,
  },
});
