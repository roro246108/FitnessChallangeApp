import { useMemo, useState } from 'react';

import {
  challengeDurationOptions,
  findMockFriendByUsername,
  friendFilterOptions,
  initialFriendRequests,
  initialFriends,
  initialPrivateChallenges,
  privateChallengeTypes,
  type Friend,
  type FriendFilter,
  type FriendRequest,
  type PrivateChallenge,
  type PrivateChallengeType,
} from '../models/FriendsModel';

export type FriendsMessageType = 'info' | 'success' | 'error';

type ChallengeDuration = (typeof challengeDurationOptions)[number];

const USERNAME_PATTERN = /^[A-Za-z0-9._]{3,20}$/;

function cloneFriends(): Friend[] {
  return initialFriends.map((friend) => ({ ...friend }));
}

function cloneRequests(): FriendRequest[] {
  return initialFriendRequests.map((request) => ({ ...request }));
}

function cloneChallenges(): PrivateChallenge[] {
  return initialPrivateChallenges.map((challenge) => ({ ...challenge }));
}

export default function useFriendsViewModel(currentUsername?: string) {
  const [username, setUsername] = useState('');
  const [friends, setFriends] = useState<Friend[]>(cloneFriends);
  const [requests, setRequests] =
    useState<FriendRequest[]>(cloneRequests);
  const [selectedActivity, setSelectedActivity] =
    useState<PrivateChallengeType>('Steps');
  const [duration, setDuration] = useState<ChallengeDuration>(7);
  const [challengeName, setChallengeName] = useState('Weekend Warriors');
  const [selectedFriends, setSelectedFriends] = useState<number[]>(() =>
    initialFriends.slice(0, 3).map((friend) => friend.id),
  );
  const [challenges, setChallenges] =
    useState<PrivateChallenge[]>(cloneChallenges);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<FriendsMessageType>('info');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendFilter, setFriendFilter] = useState<FriendFilter>('All');

  const showMessage = (
    text: string,
    type: FriendsMessageType = 'info',
  ): void => {
    setMessage(text);
    setMessageType(type);
  };

  const mostActiveFriend = useMemo<Friend | null>(() => {
    if (friends.length === 0) {
      return null;
    }

    return friends.reduce((best, friend) => {
      if (friend.workouts > best.workouts) {
        return friend;
      }

      if (
        friend.workouts === best.workouts &&
        friend.streak > best.streak
      ) {
        return friend;
      }

      return best;
    });
  }, [friends]);

  const totalFriendWorkouts = useMemo(
    () => friends.reduce((total, friend) => total + friend.workouts, 0),
    [friends],
  );

  const onStreakCount = useMemo(
    () => friends.filter((friend) => friend.streak > 0).length,
    [friends],
  );

  const filteredFriends = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return friends.filter((friend) => {
      const matchesQuery =
        !query ||
        [friend.name, friend.username, friend.activity].some((value) =>
          value.toLowerCase().includes(query),
        );

      const matchesFilter =
        friendFilter === 'All' ||
        (friendFilter === 'On streak'
          ? friend.streak > 0
          : friend.streak === 0);

      return matchesQuery && matchesFilter;
    });
  }, [friends, searchQuery, friendFilter]);

  const hasFriendFilters =
    searchQuery.trim().length > 0 || friendFilter !== 'All';

  const clearFriendFilters = (): void => {
    setSearchQuery('');
    setFriendFilter('All');
  };

  const toggleFriend = (id: number): void => {
    setSelectedFriends((current) =>
      current.includes(id)
        ? current.filter((friendId) => friendId !== id)
        : [...current, id],
    );
  };

  const addFriend = (): void => {
    const cleanUsername = username.trim().replace(/^@/, '');

    if (!cleanUsername) {
      showMessage('Please enter a username.', 'error');
      return;
    }

    if (!USERNAME_PATTERN.test(cleanUsername)) {
      showMessage(
        'Use 3-20 letters, numbers, dots, or underscores.',
        'error',
      );
      return;
    }

    const ownUsername = (currentUsername ?? '')
      .trim()
      .replace(/^@/, '')
      .toLowerCase();

    if (ownUsername && cleanUsername.toLowerCase() === ownUsername) {
      showMessage('You cannot add your own profile as a friend.', 'error');
      return;
    }

    const alreadyExists = friends.some(
      (friend) =>
        friend.username.toLowerCase() === cleanUsername.toLowerCase(),
    );

    if (alreadyExists) {
      showMessage('This friend is already in your list.', 'error');
      return;
    }

    const matchingRequest = requests.find(
      (request) =>
        request.username.replace(/^@/, '').toLowerCase() ===
        cleanUsername.toLowerCase(),
    );

    if (matchingRequest) {
      showMessage(
        `${matchingRequest.name} already sent you a request. Accept it below.`,
        'info',
      );
      return;
    }

    const mockFriend = findMockFriendByUsername(cleanUsername);

    setFriends((current) => [
      ...current,
      mockFriend ?? {
        id: Date.now(),
        name: cleanUsername,
        username: cleanUsername,
        initials: cleanUsername.slice(0, 2).toUpperCase(),
        activity: 'Added locally · no activity yet',
        workouts: 0,
        streak: 0,
        points: 0,
        color: '#A58AF7',
      },
    ]);

    setUsername('');
    showMessage(
      mockFriend
        ? `Added @${mockFriend.username} from the demo community to your friend list.`
        : `Added @${cleanUsername} to your local friend list. Account lookup is not connected.`,
      'success',
    );
  };

  const toggleRequest = (id: number, accepted: boolean): void => {
    const request = requests.find((item) => item.id === id);

    if (!request) {
      return;
    }

    if (accepted) {
      const cleanUsername = request.username.replace(/^@/, '');
      const alreadyExists = friends.some(
        (friend) =>
          friend.username.toLowerCase() === cleanUsername.toLowerCase(),
      );

      if (alreadyExists) {
        setRequests((current) =>
          current.filter((item) => item.id !== id),
        );
        showMessage(
          `${request.name} is already in your friends list.`,
          'info',
        );
        return;
      }

      setFriends((current) => [
        ...current,
        {
          id: request.id,
          name: request.name,
          username: cleanUsername,
          initials: request.initials,
          avatar: request.avatar,
          activity: request.activity,
          workouts: request.workouts,
          streak: request.streak,
          points: request.points,
          color: request.color,
        },
      ]);
      showMessage(
        `${request.name} added to your local friend list.`,
        'success',
      );
    } else {
      showMessage(`Request from ${request.name} dismissed.`, 'info');
    }

    setRequests((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const createChallenge = (): void => {
    const cleanName = challengeName.trim();

    if (!cleanName) {
      showMessage('Please enter a challenge name.', 'error');
      return;
    }

    if (selectedFriends.length === 0) {
      showMessage('Select at least one friend to invite.', 'error');
      return;
    }

    const duplicateName = challenges.some(
      (challenge) =>
        challenge.name.toLowerCase() === cleanName.toLowerCase(),
    );

    if (duplicateName) {
      showMessage(
        'A private challenge with this name already exists.',
        'error',
      );
      return;
    }

    setChallenges((current) => [
      ...current,
      {
        id: Date.now(),
        name: cleanName,
        type: selectedActivity,
        day: 1,
        total: duration,
        members: selectedFriends.length + 1,
        memberIds: [...selectedFriends],
      },
    ]);

    setChallengeName('');
    showMessage(
      'Private challenge created locally for this session.',
      'success',
    );
  };

  return {
    challengeTypeOptions: privateChallengeTypes,
    durationOptions: challengeDurationOptions,
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
  };
}

export type FriendsViewModel = ReturnType<typeof useFriendsViewModel>;
