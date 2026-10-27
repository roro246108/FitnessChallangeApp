import { useCallback, useMemo, useState } from 'react';

import type { ActivityData } from '../models/ActivityModel';
import {
  challengeTypes as challengeTypeOptions,
  fitnessActivities as activityOptions,
  genderOptions,
  getFitnessGoals,
  initialPreferences,
  initialProfile,
  profileAvatar,
  profileAvatarColor,
  type ChallengeType,
  type FitnessActivity,
  type FitnessPreferences,
  type ProfileData,
  type ProfileTextField,
} from '../models/ProfileModel';

export interface ProfileFieldErrors {
  fullName?: string;
  username?: string;
  email?: string;
  age?: string;
}

export interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9._]{3,20}$/;
const MIN_AGE = 13;
const MAX_AGE = 120;

function validateProfile(draft: ProfileData): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};
  const fullName = draft.fullName.trim();
  const username = draft.username.trim();
  const email = draft.email.trim();
  const age = draft.age.trim();

  if (fullName.length < 2) {
    errors.fullName = 'Enter your full name (at least 2 characters).';
  }

  if (username.length === 0) {
    errors.username = 'Enter a username.';
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = 'Use 3-20 letters, numbers, dots, or underscores.';
  }

  if (email.length === 0) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (age.length > 0) {
    if (!/^\d+$/.test(age)) {
      errors.age = 'Age must be a whole number.';
    } else {
      const numericAge = Number(age);

      if (numericAge < MIN_AGE || numericAge > MAX_AGE) {
        errors.age = `Age must be between ${MIN_AGE} and ${MAX_AGE}.`;
      }
    }
  }

  return errors;
}

function preferenceKey(preferences: FitnessPreferences): string {
  return [
    [...preferences.activities].sort().join('|'),
    [...preferences.challengeTypes].sort().join('|'),
  ].join('::');
}

export default function useProfileViewModel(activity: ActivityData) {
  const [profile, setProfile] = useState<ProfileData>({ ...initialProfile });
  const [draftProfile, setDraftProfile] = useState<ProfileData>({
    ...initialProfile,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<ProfileFieldErrors>({});
  const [profileFeedback, setProfileFeedback] =
    useState<FeedbackMessage | null>(null);

  const [savedPreferences, setSavedPreferences] =
    useState<FitnessPreferences>({
      activities: [...initialPreferences.activities],
      challengeTypes: [...initialPreferences.challengeTypes],
    });
  const [draftPreferences, setDraftPreferences] =
    useState<FitnessPreferences>({
      activities: [...initialPreferences.activities],
      challengeTypes: [...initialPreferences.challengeTypes],
    });
  const [preferencesFeedback, setPreferencesFeedback] =
    useState<FeedbackMessage | null>(null);

  const initials = useMemo(() => {
    const parts = profile.fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return 'U';
    }

    return parts
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [profile.fullName]);

  const fitnessGoals = useMemo(() => getFitnessGoals(activity), [activity]);

  const hasPreferenceChanges = useMemo(
    () =>
      preferenceKey(savedPreferences) !== preferenceKey(draftPreferences),
    [draftPreferences, savedPreferences],
  );

  const startEditingProfile = (): void => {
    setDraftProfile({ ...profile });
    setProfileErrors({});
    setProfileFeedback(null);
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = (): void => {
    setDraftProfile({ ...profile });
    setProfileErrors({});
    setProfileFeedback(null);
    setIsEditingProfile(false);
  };

  const updateDraftField = (
    field: ProfileTextField,
    value: string,
  ): void => {
    setDraftProfile((current) => ({ ...current, [field]: value }));
    setProfileErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
    setProfileFeedback(null);
  };

  const updateDraftProfile = (updates: Partial<ProfileData>): void => {
    setDraftProfile((current) => ({ ...current, ...updates }));
    setProfileFeedback(null);
  };

  const setAccountIdentity = useCallback((name: string, email: string): void => {
    const username =
      email.split('@')[0].replace(/[^A-Za-z0-9._]/g, '').slice(0, 20) ||
      'user';
    const updateIdentity = (current: ProfileData): ProfileData => ({
      ...current,
      fullName: name,
      username,
      email,
    });

    setProfile(updateIdentity);
    setDraftProfile(updateIdentity);
    setIsEditingProfile(false);
    setProfileErrors({});
    setProfileFeedback(null);
  }, []);

  const saveProfile = (): boolean => {
    const errors = validateProfile(draftProfile);

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setProfileFeedback({
        type: 'error',
        text: 'Please fix the highlighted fields before saving.',
      });
      return false;
    }

    const nextProfile: ProfileData = {
      fullName: draftProfile.fullName.trim(),
      username: draftProfile.username.trim(),
      email: draftProfile.email.trim(),
      age: draftProfile.age.trim(),
      gender: draftProfile.gender,
    };

    setProfile(nextProfile);
    setDraftProfile(nextProfile);
    setIsEditingProfile(false);
    setProfileErrors({});
    setProfileFeedback({
      type: 'success',
      text: 'Profile updated locally for this session.',
    });
    return true;
  };

  const toggleActivity = (activity: FitnessActivity): void => {
    setDraftPreferences((current) => ({
      ...current,
      activities: current.activities.includes(activity)
        ? current.activities.filter((item) => item !== activity)
        : [...current.activities, activity],
    }));
    setPreferencesFeedback(null);
  };

  const toggleChallengeType = (challengeType: ChallengeType): void => {
    setDraftPreferences((current) => ({
      ...current,
      challengeTypes: current.challengeTypes.includes(challengeType)
        ? current.challengeTypes.filter((item) => item !== challengeType)
        : [...current.challengeTypes, challengeType],
    }));
    setPreferencesFeedback(null);
  };

  const savePreferences = (): boolean => {
    if (!hasPreferenceChanges) {
      setPreferencesFeedback({
        type: 'success',
        text: 'Your preferences are already saved.',
      });
      return true;
    }

    setSavedPreferences({
      activities: [...draftPreferences.activities],
      challengeTypes: [...draftPreferences.challengeTypes],
    });
    setPreferencesFeedback({
      type: 'success',
      text: 'Fitness preferences saved locally for this session.',
    });
    return true;
  };

  const resetTransientState = useCallback((): void => {
    setDraftProfile({ ...profile });
    setIsEditingProfile(false);
    setProfileErrors({});
    setProfileFeedback(null);
    setDraftPreferences({
      activities: [...savedPreferences.activities],
      challengeTypes: [...savedPreferences.challengeTypes],
    });
    setPreferencesFeedback(null);
  }, [profile, savedPreferences]);

  return {
    activityOptions,
    challengeTypeOptions,
    genderOptions,
    profile,
    draftProfile,
    initials,
    avatar: profileAvatar,
    avatarColor: profileAvatarColor,
    fitnessGoals,
    isEditingProfile,
    profileErrors,
    profileFeedback,
    startEditingProfile,
    cancelEditingProfile,
    updateDraftField,
    updateDraftProfile,
    setAccountIdentity,
    saveProfile,
    selectedActivities: draftPreferences.activities,
    selectedChallengeTypes: draftPreferences.challengeTypes,
    toggleActivity,
    toggleChallengeType,
    savePreferences,
    hasPreferenceChanges,
    preferencesFeedback,
    resetTransientState,
  };
}
