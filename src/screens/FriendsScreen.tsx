import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import BottomNav from '../components/BottomNav';
import type { Colors } from '../theme/Color';
import type { FriendsViewModel } from '../viewmodels/FriendsViewModel';
import type {
  Friend,
  PrivateChallengeType,
} from '../models/FriendsModel';

type FriendsScreenProps = {
  colors: Colors;
  darkMode: boolean;
  vm: FriendsViewModel;
  onBack: () => void;
  onNavigate: (screen: string) => void;
};

interface FriendsPalette extends Colors {
  border: string;
  purple: string;
  input: string;
  surface: string;
  danger: string;
  success: string;
  onAccent: string;
  onPrimary: string;
  accentText: string;
}

interface PersonAvatarProps {
  avatar?: ImageSourcePropType;
  initials: string;
  name: string;
  fallbackColor: string;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  imageStyle: StyleProp<ImageStyle>;
}

function getChallengeTypeIcon(type: PrivateChallengeType): string {
  if (type === 'Steps') {
    return '👟';
  }

  if (type === 'Streak') {
    return '🔥';
  }

  if (type === 'Distance') {
    return '➜';
  }

  return '◷';
}

function PersonAvatar({
  avatar,
  initials,
  name,
  fallbackColor,
  style,
  textStyle,
  imageStyle,
}: PersonAvatarProps) {
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

export default function FriendsScreen({
  colors: theme,
  darkMode,
  vm,
  onBack,
  onNavigate,
}: FriendsScreenProps) {
  const {
    challengeTypeOptions,
    durationOptions,
    username,
    setUsername,
    friends,
    filteredFriends,
    friendFilterOptions,
    friendFilter,
    setFriendFilter,
    searchQuery,
    setSearchQuery,
    hasFriendFilters,
    clearFriendFilters,
    requests,
    selectedActivity,
    setSelectedActivity,
    duration,
    setDuration,
    challengeName,
    setChallengeName,
    selectedFriends,
    challenges,
    mostActiveFriend,
    totalFriendWorkouts,
    onStreakCount,
    message,
    messageType,
    toggleFriend,
    addFriend,
    toggleRequest,
    createChallenge,
  } = vm;

  const colors: FriendsPalette = {
    ...theme,
    border: theme.track,
    purple: theme.primary,
    input: darkMode ? '#1A1330' : '#FFFFFF',
    surface: darkMode ? '#1B1434' : '#F4F0FF',
    danger: darkMode ? '#FF8A8A' : '#C23D4F',
    success: darkMode ? '#CDFF7E' : '#4D7300',
    onAccent: '#171329',
    onPrimary: '#FFFFFF',
    accentText: darkMode ? theme.lavender : theme.primary,
  };

  const styles = makeStyles(colors);

  const [requestsExpanded, setRequestsExpanded] = useState(true);

  const messageAccent =
    messageType === 'error'
      ? colors.danger
      : messageType === 'success'
        ? colors.success
        : colors.lavender;

  const messageBackground =
    messageType === 'error'
      ? darkMode
        ? 'rgba(255, 138, 138, 0.12)'
        : '#FFF1F2'
      : messageType === 'success'
        ? darkMode
          ? 'rgba(205, 255, 126, 0.10)'
          : '#F4FBE9'
        : darkMode
          ? 'rgba(163, 141, 242, 0.12)'
          : '#F4F0FF';

  const messageIcon =
    messageType === 'error' ? '!' : messageType === 'success' ? '✓' : 'i';

  const messageIconColor =
    !darkMode && messageType !== 'info'
      ? colors.onPrimary
      : colors.onAccent;

  const renderEmptyState = ({
    icon,
    title,
    message: description,
    actionLabel,
    onAction,
  }: {
    icon: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  }) => (
    <View
      style={[
        styles.emptyStateCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.emptyStateIcon,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={styles.emptyStateIconText}>{icon}</Text>
      </View>

      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {title}
      </Text>

      <Text style={[styles.emptyStateText, { color: colors.muted }]}>
        {description}
      </Text>

      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={styles.clearFiltersButton}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.clearFiltersButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={[
              styles.roundButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={[styles.roundButtonText, { color: colors.text }]}>
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <View
              style={[
                styles.communityPill,
                { backgroundColor: colors.surface },
              ]}
            >
              <View style={styles.communityDot} />
              <Text style={[styles.eyebrow, { color: colors.accentText }]}>
                COMMUNITY
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              Friends & Private Challenges
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.demoNotice,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.demoNoticeIcon, { color: colors.lavender }]}>
            ⓘ
          </Text>

          <Text style={[styles.demoNoticeText, { color: colors.muted }]}>
            Demo community data · Friend actions are saved locally for this
            session.
          </Text>
        </View>

        {/* Add Friend */}
        <View
          style={[
            styles.addFriendBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.inputIcon,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={{ fontSize: 15 }}>👤</Text>
          </View>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Add a friend by username"
            placeholderTextColor={colors.muted}
            style={[styles.friendInput, { color: colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={addFriend}
            returnKeyType="done"
            accessibilityLabel="Friend username"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addFriend}
            accessibilityRole="button"
            accessibilityLabel="Add friend"
          >
            <Text style={styles.addButtonText}>Add +</Text>
          </TouchableOpacity>
        </View>

        {message ? (
          <View
            accessibilityLiveRegion="polite"
            style={[
              styles.messageBox,
              {
                backgroundColor: messageBackground,
                borderColor: messageAccent,
              },
            ]}
          >
            <View
              style={[
                styles.messageIcon,
                { backgroundColor: messageAccent },
              ]}
            >
              <Text
                style={[
                  styles.messageIconText,
                  { color: messageIconColor },
                ]}
              >
                {messageIcon}
              </Text>
            </View>

            <Text style={[styles.messageText, { color: colors.text }]}>
              {message}
            </Text>
          </View>
        ) : null}

        {/* Weekly Summary */}
        <View style={styles.summaryGrid}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.purple },
            ]}
          >
            <View style={styles.summaryOrb} />

            <Text style={styles.summaryLabel}>FRIEND WORKOUTS</Text>

            <Text style={styles.summaryNumber}>
              {totalFriendWorkouts}
            </Text>

            <Text style={styles.summaryDescription}>
              workouts{'\n'}completed by friends
            </Text>

            <View style={styles.miniAvatars}>
              {friends.slice(0, 4).map((friend) => (
                <PersonAvatar
                  key={friend.id}
                  avatar={friend.avatar}
                  initials={friend.initials}
                  name={friend.name}
                  fallbackColor={friend.color}
                  style={[styles.miniAvatar, { borderColor: colors.lime }]}
                  textStyle={styles.miniAvatarText}
                  imageStyle={styles.avatarImage}
                />
              ))}

              {friends.length > 4 ? (
                <View
                  style={[
                    styles.miniAvatarCount,
                    { backgroundColor: colors.lime },
                  ]}
                >
                  <Text style={styles.miniAvatarCountText}>
                    +{friends.length - 4}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.summarySide}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={styles.statIconText}>👥</Text>
              </View>

              <Text style={[styles.sideStatNumber, { color: colors.text }]}>
                {friends.length}
              </Text>

              <Text
                style={[
                  styles.summaryStatLabel,
                  { color: colors.muted },
                ]}
              >
                Friends
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={styles.statIconText}>🔥</Text>
              </View>

              <Text style={[styles.sideStatNumber, { color: colors.text }]}>
                {onStreakCount}
              </Text>

              <Text
                style={[
                  styles.summaryStatLabel,
                  { color: colors.muted },
                ]}
              >
                On streak
              </Text>
            </View>
          </View>
        </View>

        {/* Most Active */}
        <View
          style={[
            styles.mostActiveCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.trophyIcon}>
            <Text style={styles.trophyIconText}>🏆</Text>
          </View>

          <View style={styles.mostActiveText}>
            <Text
              style={[
                styles.mostActiveCaption,
                { color: colors.muted },
              ]}
            >
              Most active friend
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.mostActiveName, { color: colors.text }]}
            >
              {mostActiveFriend
                ? `@${mostActiveFriend.username}`
                : 'No friend activity yet'}
            </Text>

            {mostActiveFriend ? (
              <Text
                numberOfLines={1}
                style={[styles.mostActiveMeta, { color: colors.muted }]}
              >
                {mostActiveFriend.workouts} workouts ·{' '}
                {`${mostActiveFriend.streak} day${
                  mostActiveFriend.streak === 1 ? '' : 's'
                } streak`}
              </Text>
            ) : null}
          </View>

          {mostActiveFriend ? (
            <PersonAvatar
              avatar={mostActiveFriend.avatar}
              initials={mostActiveFriend.initials}
              name={mostActiveFriend.name}
              fallbackColor={mostActiveFriend.color}
              style={styles.mostActiveAvatar}
              textStyle={styles.miniAvatarText}
              imageStyle={styles.avatarImage}
            />
          ) : null}
        </View>

        {/* Friend Requests */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setRequestsExpanded((current) => !current)}
          style={[
            styles.requestsHeaderCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Friend requests, ${requests.length} pending, ${
            requestsExpanded ? 'expanded' : 'collapsed'
          }`}
          accessibilityState={{ expanded: requestsExpanded }}
        >
          <View
            style={[
              styles.requestsHeaderIcon,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={styles.requestsHeaderIconText}>📨</Text>
          </View>

          <View style={styles.requestsHeaderText}>
            <View style={styles.requestsTitleRow}>
              <Text style={[styles.requestsTitle, { color: colors.text }]}>
                Friend Requests
              </Text>

              {requests.length > 0 ? (
                <View
                  style={[
                    styles.requestsCountBadge,
                    { backgroundColor: colors.lime },
                  ]}
                >
                  <Text style={styles.requestsCountText}>
                    {requests.length} pending
                  </Text>
                </View>
              ) : null}
            </View>

            <Text
              style={[styles.requestsHeaderMeta, { color: colors.muted }]}
            >
              {requests.length === 0
                ? 'You are all caught up'
                : requestsExpanded
                  ? 'Tap to collapse'
                  : 'Tap to view requests'}
            </Text>
          </View>

          <View
            style={[
              styles.requestsChevron,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.requestsChevronText,
                { color: colors.accentText },
              ]}
            >
              {requestsExpanded ? '⌃' : '⌄'}
            </Text>
          </View>
        </TouchableOpacity>

        {requestsExpanded ? (
          requests.length === 0 ? (
            <View
              style={[
                styles.requestsEmpty,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.requestsEmptyIcon,
                  { color: colors.accentText },
                ]}
              >
                ✓
              </Text>

              <Text
                style={[styles.requestsEmptyText, { color: colors.muted }]}
              >
                No pending requests
              </Text>
            </View>
          ) : (
            requests.map((request) => (
              <View
                key={request.id}
                style={[
                  styles.requestCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.requestAccent,
                    { backgroundColor: colors.lavender },
                  ]}
                />

                <PersonAvatar
                  avatar={request.avatar}
                  initials={request.initials}
                  name={request.name}
                  fallbackColor={request.color}
                  style={styles.avatar}
                  textStyle={styles.avatarText}
                  imageStyle={styles.avatarImage}
                />

                <View style={styles.friendDetails}>
                  <Text
                    numberOfLines={1}
                    style={[styles.friendName, { color: colors.text }]}
                  >
                    {request.name}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.friendActivity,
                      { color: colors.muted },
                    ]}
                  >
                    {request.username} · {request.activity}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.requestAction,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => toggleRequest(request.id, false)}
                  accessibilityRole="button"
                  accessibilityLabel={`Decline ${request.name}'s request`}
                >
                  <Text
                    style={{
                      color: colors.danger,
                      fontSize: 18,
                      fontWeight: '700',
                    }}
                  >
                    ×
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.requestAction,
                    { backgroundColor: colors.lime },
                  ]}
                  onPress={() => toggleRequest(request.id, true)}
                  accessibilityRole="button"
                  accessibilityLabel={`Accept ${request.name}'s request`}
                >
                  <Text
                    style={{
                      color: colors.onAccent,
                      fontSize: 18,
                      fontWeight: '800',
                    }}
                  >
                    ✓
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )
        ) : null}

        {/* My Friends */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleWrap}>
            <View style={styles.sectionAccent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              My Friends
            </Text>
          </View>

          <Text
            style={[
              styles.sectionMetaPill,
              {
                color: colors.accentText,
                backgroundColor: colors.surface,
              },
            ]}
          >
            {hasFriendFilters
              ? `${filteredFriends.length} shown`
              : `${friends.length} friends`}
          </Text>
        </View>

        <View
          style={[
            styles.friendSearchBox,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.lavender, fontSize: 16 }}>⌕</Text>

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search friends"
            placeholderTextColor={colors.muted}
            style={[styles.friendSearchInput, { color: colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search friends"
          />

          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear friend search"
            >
              <Text style={{ color: colors.muted, fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.friendFilterRow}>
          {friendFilterOptions.map((option) => {
            const selected = friendFilter === option;

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Filter friends: ${option}`}
                accessibilityState={{ selected }}
                onPress={() => setFriendFilter(option)}
                style={[
                  styles.friendFilterPill,
                  {
                    backgroundColor: selected
                      ? colors.purple
                      : colors.input,
                    borderColor: selected ? colors.lime : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.friendFilterPillText,
                    { color: selected ? colors.onPrimary : colors.muted },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {friends.length === 0 ? (
          renderEmptyState({
            icon: '👋',
            title: 'Your circle is empty',
            message:
              'Add a demo username above to start connecting with friends.',
          })
        ) : filteredFriends.length === 0 ? (
          renderEmptyState({
            icon: '🔎',
            title: 'No friends found',
            message: 'Try another search or clear your current filters.',
            actionLabel: 'Clear filters',
            onAction: clearFriendFilters,
          })
        ) : (
          filteredFriends.map((friend) => (
          <View
            key={friend.id}
            style={[
              styles.friendCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.avatarWrap}>
              <PersonAvatar
                avatar={friend.avatar}
                initials={friend.initials}
                name={friend.name}
                fallbackColor={friend.color}
                style={styles.avatar}
                textStyle={styles.avatarText}
                imageStyle={styles.avatarImage}
              />

              {friend.streak > 0 ? (
                <View style={styles.onlineDot} />
              ) : null}
            </View>

            <View style={styles.friendDetails}>
              <Text
                numberOfLines={1}
                style={[styles.friendName, { color: colors.text }]}
              >
                {friend.name}
                {mostActiveFriend?.id === friend.id ? ' 🏆' : ''}
              </Text>

              <Text
                numberOfLines={1}
                style={[styles.friendHandle, { color: colors.muted }]}
              >
                @{friend.username}
              </Text>

              <View
                style={[
                  styles.activityPill,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.friendActivity,
                    { color: colors.muted },
                  ]}
                >
                  {friend.activity}
                </Text>
              </View>
            </View>

            <View style={styles.friendStats}>
              <View
                style={[
                  styles.statBadge,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.statBadgeText, { color: colors.text }]}>
                  🏋 {friend.workouts}
                </Text>
              </View>

              <View
                style={[
                  styles.statBadge,
                  {
                    backgroundColor:
                      friend.streak > 0 ? colors.lime : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statBadgeText,
                    {
                      color:
                        friend.streak > 0
                          ? colors.onAccent
                          : colors.muted,
                    },
                  ]}
                >
                  🔥 {friend.streak}
                </Text>
              </View>
            </View>
          </View>
          ))
        )}

        {/* Create Private Challenge */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleWrap}>
            <View style={styles.sectionAccent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Create a Private Challenge
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.challengeForm,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.formIntro, { color: colors.muted }]}>
            Set up a private challenge in four quick steps.
          </Text>

          {/* Step 1 */}
          <View style={styles.formStepHeading}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Challenge name
            </Text>
          </View>

          <View
            style={[
              styles.challengeInputWrap,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: colors.lavender, fontSize: 15 }}>
              ✎
            </Text>

            <TextInput
              value={challengeName}
              onChangeText={setChallengeName}
              placeholder="e.g. Weekend Warriors"
              placeholderTextColor={colors.muted}
              style={[styles.challengeInput, { color: colors.text }]}
            />
          </View>

          {/* Step 2 */}
          <View style={styles.formStepHeading}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Challenge type
            </Text>
          </View>

          <View style={styles.typeGrid}>
            {challengeTypeOptions.map((type) => {
              const selected = selectedActivity === type;

              const typeIcon = getChallengeTypeIcon(type);

              return (
                <TouchableOpacity
                  key={type}
                  accessibilityRole="button"
                  accessibilityLabel={`${type} challenge type`}
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedActivity(type)}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: selected
                        ? colors.purple
                        : colors.input,
                      borderColor: selected
                        ? colors.lime
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? colors.lime : colors.lavender,
                      fontSize: 20,
                    }}
                  >
                    {typeIcon}
                  </Text>

                  <Text
                    style={{
                      color: selected ? colors.onPrimary : colors.text,
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Step 3 */}
          <View style={styles.formStepHeading}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Duration
            </Text>
          </View>

          <View
            style={[
              styles.durationBox,
              { borderColor: colors.border },
            ]}
          >
            {durationOptions.map((days) => (
              <TouchableOpacity
                key={days}
                accessibilityRole="button"
                accessibilityLabel={`${days} day challenge`}
                accessibilityState={{ selected: duration === days }}
                onPress={() => setDuration(days)}
                style={[
                  styles.durationOption,
                  {
                    backgroundColor:
                      duration === days
                        ? colors.purple
                        : 'transparent',
                    borderColor:
                      duration === days
                        ? colors.lime
                        : 'transparent',
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      duration === days ? colors.lime : colors.text,
                    fontWeight: '800',
                    fontSize: 18,
                  }}
                >
                  {days}
                </Text>

                <Text
                  style={{
                    color:
                      duration === days ? colors.onPrimary : colors.muted,
                    fontSize: 10,
                  }}
                >
                  days
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Step 4 */}
          <View style={styles.formStepHeading}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text }]}>
              Invite friends ({selectedFriends.length} selected)
            </Text>
          </View>

          <View style={styles.inviteGrid}>
            {friends.length === 0 ? (
              <Text
                style={[styles.emptyStateText, { color: colors.muted }]}
              >
                Add a friend before creating a private challenge.
              </Text>
            ) : null}

            {friends.map((friend) => {
              const selected = selectedFriends.includes(friend.id);

              return (
                <TouchableOpacity
                  key={friend.id}
                  onPress={() => toggleFriend(friend.id)}
                  style={styles.invitePerson}
                  accessibilityRole="button"
                  accessibilityLabel={`${selected ? 'Remove' : 'Invite'} ${friend.username}`}
                  accessibilityState={{ selected }}
                >
                  <View style={styles.inviteAvatarWrap}>
                    <PersonAvatar
                      avatar={friend.avatar}
                      initials={friend.initials}
                      name={friend.name}
                      fallbackColor={friend.color}
                      style={[
                        styles.inviteAvatar,
                        {
                          borderColor: selected
                            ? colors.lime
                            : colors.border,
                        },
                      ]}
                      textStyle={styles.avatarText}
                      imageStyle={styles.avatarImage}
                    />

                    {selected ? (
                      <View
                        style={[
                          styles.inviteCheck,
                          { backgroundColor: colors.lime },
                        ]}
                      >
                        <Text style={styles.inviteCheckText}>✓</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.inviteName,
                      {
                        color: selected ? colors.text : colors.muted,
                        fontWeight: selected ? '900' : '700',
                      },
                    ]}
                  >
                    {friend.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: colors.lime },
            ]}
            onPress={createChallenge}
            accessibilityRole="button"
            accessibilityLabel="Create private challenge"
          >
            <Text style={styles.createButtonText}>
              🔒 Create Private Challenge →
            </Text>
          </TouchableOpacity>
        </View>

        {/* My Private Challenges */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleWrap}>
            <View style={styles.sectionAccent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              My Private Challenges
            </Text>
          </View>

          <Text
            style={[
              styles.sectionMetaPill,
              {
                color: colors.accentText,
                backgroundColor: colors.surface,
              },
            ]}
          >
            {challenges.length} active
          </Text>
        </View>

        {challenges.length === 0 ? (
          renderEmptyState({
            icon: '🔒',
            title: 'No private challenges yet',
            message:
              'Create one above and invite friends to get started together.',
          })
        ) : (
          challenges.map((challenge) => {
            const challengeFriends = challenge.memberIds
              .map((memberId) =>
                friends.find((friend) => friend.id === memberId),
              )
              .filter((friend): friend is Friend => Boolean(friend))
              .slice(0, 4);

            const extraMembers = Math.max(
              0,
              challenge.members - challengeFriends.length,
            );

            return (
              <View
                key={challenge.id}
                style={[
                  styles.privateChallengeCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.challengeTopRow}>
                  <View
                    style={[
                      styles.challengeIcon,
                      { backgroundColor: colors.purple },
                    ]}
                  >
                    <Text style={styles.challengeIconText}>
                      {getChallengeTypeIcon(challenge.type)}
                    </Text>
                  </View>

                  <View style={styles.challengeDetails}>
                    <Text
                      numberOfLines={1}
                      style={[styles.friendName, { color: colors.text }]}
                    >
                      {challenge.name}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.friendActivity,
                        { color: colors.muted },
                      ]}
                    >
                      🔒 Private · {challenge.type} · {challenge.members}{' '}
                      people
                    </Text>

                    <View style={styles.challengeParticipants}>
                      {challengeFriends.map((friend) => (
                        <PersonAvatar
                          key={friend.id}
                          avatar={friend.avatar}
                          initials={friend.initials}
                          name={friend.name}
                          fallbackColor={friend.color}
                          style={[
                            styles.participantAvatar,
                            { borderColor: colors.card },
                          ]}
                          textStyle={styles.participantAvatarText}
                          imageStyle={styles.avatarImage}
                        />
                      ))}

                      {extraMembers > 0 ? (
                        <View
                          style={[
                            styles.participantMore,
                            {
                              backgroundColor: colors.surface,
                              borderColor: colors.card,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.participantMoreText,
                              { color: colors.muted },
                            ]}
                          >
                            +{extraMembers}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.dayBadge,
                      {
                        backgroundColor: colors.lime,
                        color: colors.onAccent,
                      },
                    ]}
                  >
                    Day {challenge.day}/{challenge.total}
                  </Text>
                </View>

                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          100,
                          (challenge.day / challenge.total) * 100,
                        )}%`,
                        backgroundColor: colors.purple,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomNav
        colors={theme}
        activeScreen="Friends"
        onNavigate={onNavigate}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: FriendsPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 30,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      marginBottom: 18,
    },

    headerText: {
      flex: 1,
    },

    communityPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: 20,
      paddingHorizontal: 9,
      paddingVertical: 4,
      marginBottom: 7,
      gap: 5,
    },

    communityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.lime,
    },

    eyebrow: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1.2,
    },

    title: {
      fontSize: 22,
      lineHeight: 27,
      fontWeight: '900',
      marginTop: 1,
    },

    roundButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    roundButtonText: {
      fontSize: 23,
      fontWeight: '700',
    },

    addFriendBox: {
      minHeight: 56,
      borderWidth: 1,
      borderRadius: 20,
      paddingLeft: 8,
      paddingRight: 6,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      gap: 9,
    },

    inputIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },

    friendInput: {
      flex: 1,
      fontSize: 13,
      paddingHorizontal: 3,
    },

    addButton: {
      backgroundColor: colors.purple,
      borderRadius: 15,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },

    addButtonText: {
      color: colors.onPrimary,
      fontWeight: '900',
      fontSize: 12,
    },

    messageBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 9,
      marginBottom: 12,
      gap: 9,
    },

    messageIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },

    messageIconText: {
      color: colors.onAccent,
      fontSize: 12,
      fontWeight: '900',
    },

    messageText: {
      flex: 1,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '600',
    },

    demoNotice: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 11,
      paddingVertical: 9,
      marginBottom: 12,
      gap: 8,
    },

    demoNoticeIcon: {
      fontSize: 14,
      lineHeight: 16,
      fontWeight: '700',
    },

    demoNoticeText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 15,
    },

    friendSearchBox: {
      minHeight: 48,
      borderWidth: 1,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      gap: 8,
    },

    friendSearchInput: {
      flex: 1,
      minHeight: 43,
      fontSize: 12,
      paddingVertical: 7,
    },

    clearSearch: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },

    friendFilterRow: {
      flexDirection: 'row',
      gap: 7,
      marginTop: 9,
      marginBottom: 10,
    },

    friendFilterPill: {
      flex: 1,
      minHeight: 34,
      borderWidth: 1,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },

    friendFilterPillText: {
      fontSize: 10,
      fontWeight: '800',
    },

    clearFiltersButton: {
      alignSelf: 'center',
      backgroundColor: colors.lime,
      borderRadius: 14,
      paddingHorizontal: 15,
      paddingVertical: 9,
      marginTop: 12,
    },

    clearFiltersButtonText: {
      color: colors.onAccent,
      fontSize: 11,
      fontWeight: '900',
    },

    summaryGrid: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 5,
    },

    summaryCard: {
      flex: 1.65,
      minHeight: 184,
      borderRadius: 23,
      padding: 14,
      marginBottom: 0,
      overflow: 'hidden',
    },

    summaryOrb: {
      position: 'absolute',
      width: 125,
      height: 125,
      borderRadius: 63,
      right: -40,
      top: -40,
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
    },

    summaryLabel: {
      color: colors.onPrimary,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.7,
    },

    summaryNumber: {
      color: colors.lime,
      fontSize: 49,
      lineHeight: 54,
      fontWeight: '900',
      marginTop: 6,
    },

    summaryDescription: {
      color: colors.onPrimary,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '800',
      marginTop: 2,
    },

    miniAvatars: {
      flexDirection: 'row',
      marginTop: 14,
      alignItems: 'center',
    },

    miniAvatar: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -6,
      overflow: 'hidden',
    },

    miniAvatarText: {
      color: colors.onAccent,
      fontSize: 8,
      fontWeight: '900',
    },

    miniAvatarCount: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: colors.lime,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
    },

    miniAvatarCountText: {
      color: colors.onAccent,
      fontSize: 8,
      fontWeight: '900',
    },

    summarySide: {
      flex: 1,
      gap: 9,
    },

    statCard: {
      flex: 1,
      borderRadius: 18,
      borderWidth: 1,
      padding: 10,
      justifyContent: 'center',
    },

    statIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },

    statIconText: {
      fontSize: 14,
    },

    sideStatNumber: {
      fontSize: 22,
      fontWeight: '900',
    },

    summaryStatLabel: {
      fontSize: 10,
      fontWeight: '600',
      marginTop: 1,
    },

    mostActiveCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 19,
      padding: 11,
      marginTop: 9,
      marginBottom: 22,
      gap: 10,
    },

    trophyIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.lime,
      alignItems: 'center',
      justifyContent: 'center',
    },

    trophyIconText: {
      fontSize: 18,
    },

    mostActiveText: {
      flex: 1,
    },

    mostActiveCaption: {
      fontSize: 10,
      fontWeight: '700',
    },

    mostActiveName: {
      fontSize: 13,
      fontWeight: '900',
      marginTop: 1,
    },

    mostActiveMeta: {
      fontSize: 9,
      fontWeight: '600',
      marginTop: 2,
    },

    mostActiveAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 2,
      borderColor: colors.lime,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 10,
      gap: 8,
    },

    sectionTitleWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },

    sectionAccent: {
      width: 4,
      height: 18,
      borderRadius: 3,
      backgroundColor: colors.lime,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: '900',
    },

    sectionMetaPill: {
      fontSize: 10,
      fontWeight: '800',
      overflow: 'hidden',
      borderRadius: 12,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },

    requestsHeaderCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 19,
      padding: 11,
      marginTop: 8,
      marginBottom: 10,
      gap: 10,
    },

    requestsHeaderIcon: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },

    requestsHeaderIconText: {
      fontSize: 17,
    },

    requestsHeaderText: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },

    requestsTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    requestsTitle: {
      fontSize: 15,
      fontWeight: '900',
    },

    requestsCountBadge: {
      borderRadius: 9,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },

    requestsCountText: {
      color: colors.onAccent,
      fontSize: 9,
      fontWeight: '900',
    },

    requestsHeaderMeta: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
    },

    requestsChevron: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    requestsChevronText: {
      fontSize: 15,
      lineHeight: 18,
      fontWeight: '800',
    },

    requestsEmpty: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
      gap: 8,
    },

    requestsEmptyIcon: {
      fontSize: 13,
      fontWeight: '900',
    },

    requestsEmptyText: {
      fontSize: 10.5,
      fontWeight: '600',
    },

    requestCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 18,
      padding: 10,
      marginBottom: 8,
      gap: 10,
      overflow: 'hidden',
    },

    requestAccent: {
      width: 3,
      alignSelf: 'stretch',
      borderRadius: 3,
      marginLeft: -10,
    },

    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    avatarImage: {
      width: '100%',
      height: '100%',
    },

    avatarText: {
      fontSize: 12,
      fontWeight: '900',
      color: colors.onAccent,
    },

    friendDetails: {
      flex: 1,
      minWidth: 0,
      gap: 3,
    },

    friendName: {
      fontSize: 12.5,
      fontWeight: '900',
    },

    friendHandle: {
      fontSize: 9.5,
      fontWeight: '600',
      marginTop: 1,
    },

    friendActivity: {
      fontSize: 9.5,
      marginTop: 2,
    },

    requestAction: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    friendCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 19,
      padding: 10,
      marginBottom: 8,
      gap: 10,
    },

    avatarWrap: {
      position: 'relative',
    },

    onlineDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
      right: -1,
      bottom: -1,
      backgroundColor: colors.lime,
      borderWidth: 2,
      borderColor: colors.card,
    },

    activityPill: {
      alignSelf: 'flex-start',
      borderRadius: 9,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 6,
      paddingVertical: 3,
      maxWidth: '100%',
    },

    friendStats: {
      alignItems: 'flex-end',
      gap: 5,
    },

    statBadge: {
      overflow: 'hidden',
      borderRadius: 9,
      paddingHorizontal: 7,
      paddingVertical: 4,
    },

    statBadgeText: {
      fontSize: 10,
      fontWeight: '900',
    },

    challengeForm: {
      borderWidth: 1,
      borderRadius: 23,
      padding: 15,
      marginBottom: 22,
    },

    formIntro: {
      fontSize: 10,
      lineHeight: 15,
      marginTop: -2,
      marginBottom: 5,
    },

    formStepHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 11,
      marginBottom: 8,
    },

    stepNumber: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.purple,
      alignItems: 'center',
      justifyContent: 'center',
    },

    stepNumberText: {
      color: colors.onPrimary,
      fontSize: 10,
      fontWeight: '900',
    },

    fieldLabel: {
      fontSize: 11,
      fontWeight: '800',
    },

    challengeInputWrap: {
      minHeight: 43,
      borderWidth: 1,
      borderRadius: 13,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 11,
      gap: 9,
    },

    challengeInput: {
      flex: 1,
      minHeight: 42,
      fontSize: 12,
      paddingVertical: 7,
    },

    typeGrid: {
      flexDirection: 'row',
      gap: 7,
    },

    typeOption: {
      flex: 1,
      minHeight: 76,
      borderWidth: 1,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingHorizontal: 2,
      paddingVertical: 8,
    },

    durationBox: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 15,
      padding: 4,
      gap: 5,
    },

    durationOption: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      borderRadius: 12,
    },

    inviteGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
      marginTop: 2,
      marginBottom: 14,
    },

    invitePerson: {
      width: 54,
      alignItems: 'center',
      gap: 5,
    },

    inviteAvatarWrap: {
      position: 'relative',
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },

    inviteAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    inviteCheck: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: 17,
      height: 17,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    inviteCheckText: {
      color: colors.onAccent,
      fontSize: 9,
      fontWeight: '900',
    },

    inviteName: {
      fontSize: 9,
      fontWeight: '700',
    },

    createButton: {
      borderRadius: 17,
      minHeight: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 3,
      paddingHorizontal: 8,
    },

    createButtonText: {
      color: colors.onAccent,
      fontWeight: '900',
      fontSize: 12,
    },

    privateChallengeCard: {
      borderWidth: 1,
      borderRadius: 19,
      padding: 12,
      marginBottom: 10,
      gap: 10,
    },

    challengeTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    challengeIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },

    challengeIconText: {
      fontSize: 20,
    },

    challengeDetails: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },

    challengeParticipants: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 7,
    },

    participantAvatar: {
      width: 23,
      height: 23,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -5,
      overflow: 'hidden',
    },

    participantAvatarText: {
      color: colors.onAccent,
      fontSize: 7,
      fontWeight: '900',
    },

    participantMore: {
      width: 23,
      height: 23,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 2,
    },

    participantMoreText: {
      fontSize: 7,
      fontWeight: '900',
    },

    dayBadge: {
      overflow: 'hidden',
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 5,
      fontSize: 10,
      fontWeight: '900',
      alignSelf: 'flex-start',
    },

    progressTrack: {
      width: '100%',
      height: 7,
      borderRadius: 4,
      overflow: 'hidden',
    },

    progressFill: {
      height: 7,
      borderRadius: 4,
    },

    emptyStateCard: {
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 19,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 10,
    },

    emptyStateIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },

    emptyStateIconText: {
      fontSize: 19,
    },

    emptyStateTitle: {
      fontSize: 13,
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: 4,
    },

    emptyStateText: {
      maxWidth: 260,
      fontSize: 11,
      lineHeight: 17,
      textAlign: 'center',
    },
  });
}