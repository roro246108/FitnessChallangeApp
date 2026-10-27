import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandHeader from '../components/BrandHeader';
import ShareWithSection, { type Visibility } from '../components/ShareWithSection';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';
import { IoniconName } from '../models/icons';
import { EvidenceStatus, Workout } from '../models/evidence';
import StreakBanner from '../components/StreakBanner';
import EvidenceHistory from '../components/EvidenceHistory';
import { Pulse, StepIndicator, TimelineRow } from '../components/UploadEvidencePieces';
import { INK, STATUS_COLORS, makeStyles, makeTheme } from '../theme/uploadEvidenceStyles';
import {
  completeChallengeDay,
  getLocalDateKey,
  rejectChallengeDay,
} from '../data/challengeProgress';
import {
  MAX_MB,
  MAX_PHOTOS,
  haptic,
  useUploadEvidenceViewModel,
} from '../viewmodels/useUploadEvidenceViewModel';
import useEvidenceHistory from '../viewmodels/useEvidenceHistory';

const DEFAULT_WORKOUT: Workout = {
  title: 'Full Body Workout',
  duration: '30 min',
  level: 'Intermediate',
};

interface Props {
  challengeId: string;
  challengeTitle?: string;
  onBack: () => void;
}

export default function UploadEvidenceScreen({
  challengeId,
  challengeTitle,
  onBack,
}: Props) {
  const { colors, isDark } = useTheme();
  const t = useMemo(() => makeTheme(colors, isDark), [colors, isDark]);
  const s = useMemo(() => makeStyles(t), [t]);

  const workout: Workout = challengeTitle
    ? { ...DEFAULT_WORKOUT, title: challengeTitle }
    : DEFAULT_WORKOUT;

  const vm = useUploadEvidenceViewModel(null);
  const {
    images,
    selected,
    note,
    setNote,
    uploading,
    progress,
    error,
    status,
    setStatus,
    submittedAt,
    submitCount,
    stepIndex,
  } = vm;

  // submissions log (saved on the device)
  const history = useEvidenceHistory();
  const challengeRecords = history.records.filter(
    (record) =>
      record.challengeId === challengeId ||
      (!record.challengeId && record.challenge === workout.title),
  );
  const [visibility, setVisibility] = useState<Visibility>('community'); 
  const submittedDateKey = useRef<string | null>(null);

  // every finished upload is added to the log once
  useEffect(() => {
    if (submitCount === 0) return;
    history.add({
      challengeId,
      challenge: workout.title,
      uri: images[selected] ?? images[0] ?? '',
      note,
      status: 'pending',
      visibility,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  useEffect(() => {
    if (submitCount === 0 || !status) return;
    if (status === 'rejected') {
      const dateKey = submittedDateKey.current;
      submittedDateKey.current = null;
      if (!dateKey) return;
      void rejectChallengeDay(challengeId, dateKey).catch((error: unknown) => {
        console.warn('Unable to update challenge progress from evidence:', error);
      });
      return;
    }

    const dateKey = submittedDateKey.current ?? getLocalDateKey();
    submittedDateKey.current = dateKey;
    const updateChallengeProgress = completeChallengeDay(challengeId, dateKey);
    void updateChallengeProgress.catch((error: unknown) => {
      console.warn('Unable to update challenge progress from evidence:', error);
    });
  }, [challengeId, status, submitCount]);

  const [sheet, setSheet] = useState(false);

  // entrance animation (once)
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, [enter]);

  // press animation for the main button
  const press = useRef(new Animated.Value(1)).current;
  const pressTo = (v: number) =>
    Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40 }).start();

  const chooseSource = (fn: () => Promise<void>) => {
    setSheet(false);
    haptic();
    setTimeout(fn, 350);
  };

  const openSheet = () => {
    haptic();
    setSheet(true);
  };

  /* ---------------------------- views ---------------------------- */
  const renderHeader = () => (
    <LinearGradient colors={[t.headerTop, t.bg]} style={s.header}>
      <View style={s.headerRow}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={t.text} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Upload Evidence</Text>
          <Text style={s.headerSub}>Show us you did it</Text>
        </View>
        <View style={s.backBtnGhost} />
      </View>
      <StepIndicator current={stepIndex} status={status} t={t} s={s} />
    </LinearGradient>
  );

  const renderWorkoutCard = () => (
    <View style={s.workoutCard}>
      <View style={s.workoutBar} />
      <LinearGradient colors={[t.primary, t.primaryDark]} style={s.workoutIcon}>
        <Ionicons name="barbell-outline" size={24} color="#fff" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={s.workoutTitle}>{workout.title}</Text>
        <View style={s.chipsRow}>
          <View style={s.chip}>
            <Ionicons name="time-outline" size={12} color={t.primary} />
            <Text style={s.chipText}>{workout.duration}</Text>
          </View>
          <View style={s.chip}>
            <Ionicons name="flash-outline" size={12} color={t.primary} />
            <Text style={s.chipText}>{workout.level}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDropzone = () => (
    <View style={s.dropzone}>
      <View style={[s.bubble, { width: 140, height: 140, top: -50, right: -40 }]} />
      <View style={[s.bubble, { width: 90, height: 90, bottom: -30, left: -20 }]} />
      <Pulse style={s.dropIcon}>
        <Ionicons name="camera-outline" size={32} color={t.primary} />
      </Pulse>
      <Text style={s.dropTitle}>Add a photo of your workout</Text>
      <Text style={s.dropSub}>JPG or PNG, up to {MAX_MB}MB</Text>
      <TouchableOpacity style={{ marginTop: 18 }} onPress={openSheet}>
        <LinearGradient
          colors={[t.primary, t.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.addBtn}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={s.addBtnText}>Add photo</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderPreview = () => (
    <View>
      <View style={s.previewWrap}>
        <Image source={{ uri: images[selected] }} style={s.preview} resizeMode="cover" />
        <View style={s.readyBadge}>
          <Ionicons name="checkmark-circle" size={14} color={INK} />
          <Text style={s.readyText}>Ready to upload</Text>
        </View>
        <TouchableOpacity style={s.removeBtn} onPress={() => vm.removeImage(selected)}>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={s.thumbRow}>
        {images.map((uri, i) => (
          <TouchableOpacity
            key={uri + i}
            onPress={() => vm.selectImage(i)}
            style={[s.thumb, i === selected && { borderColor: t.primary }]}
          >
            <Image source={{ uri }} style={s.thumbImg} />
          </TouchableOpacity>
        ))}
        {images.length < MAX_PHOTOS && (
          <TouchableOpacity style={[s.thumb, s.thumbAdd]} onPress={openSheet}>
            <Ionicons name="add" size={24} color={t.primary} />
          </TouchableOpacity>
        )}
        <Text style={s.thumbCount}>
          {images.length}/{MAX_PHOTOS}
        </Text>
      </View>
    </View>
  );

  const renderForm = () => (
    <>
      <StreakBanner streak={12} doneToday={false} />

      <View style={{ height: 16 }} />
      {renderWorkoutCard()}

      <Text style={s.sectionTitle}>Workout photos</Text>
      {images.length === 0 ? renderDropzone() : renderPreview()}

      <View style={s.tipCard}>
        <View style={s.tipIcon}>
          <Ionicons name="bulb-outline" size={18} color={t.primary} />
        </View>
        <Text style={s.tipText}>
          Make sure you or your equipment are clearly visible in the photo.
        </Text>
      </View>

      <Text style={s.sectionTitle}>Note (optional)</Text>
      <TextInput
        style={s.input}
        placeholder="Add details about your workout"
        placeholderTextColor={t.sub}
        value={note}
        onChangeText={setNote}
        multiline
      />

            <ShareWithSection
        value={visibility}
        onChange={setVisibility}
        challengeTitle={workout.title}
      />

      <View style={s.pointsBadge}>
        <Ionicons name="trophy-outline" size={16} color={INK} />
        <Text style={s.pointsText}>+50 points when verified</Text>
      </View>

      {!!error && (
        <View style={s.errorRow}>
          <Ionicons name="alert-circle" size={16} color={STATUS_COLORS.rejected} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {uploading && (
        <View style={s.progressWrap}>
          <View style={s.progressHead}>
            <Text style={s.progressLabel}>Uploading evidence</Text>
            <Text style={s.progressPct}>{Math.round(progress)}%</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      <Animated.View style={{ transform: [{ scale: press }] }}>
        <Pressable
          onPress={vm.upload}
          onPressIn={() => pressTo(0.97)}
          onPressOut={() => pressTo(1)}
          disabled={uploading}
          style={[s.uploadBtn, uploading && { opacity: 0.6 }]}
        >
          <Ionicons name="cloud-upload-outline" size={20} color={INK} />
          <Text style={s.uploadBtnText}>{uploading ? 'Uploading...' : 'Upload evidence'}</Text>
        </Pressable>
      </Animated.View>

      <EvidenceHistory
  records={challengeRecords}
  onDelete={history.remove}
  onToggleVisibility={history.toggleVisibility}
/>
    </>
  );

  const renderDone = (current: EvidenceStatus) => {
    const metaByStatus: Record<
      EvidenceStatus,
      { icon: IoniconName; color: string; bg: string; title: string; sub: string }
    > = {
      pending: {
        icon: 'checkmark',
        color: t.primary,
        bg: t.tint,
        title: 'Evidence uploaded!',
        sub: "We'll review it shortly.",
      },
      verified: {
        icon: 'ribbon-outline',
        color: STATUS_COLORS.verified,
        bg: t.verifiedBg,
        title: 'Evidence verified!',
        sub: 'Great job! Your points were added.',
      },
      rejected: {
        icon: 'close',
        color: STATUS_COLORS.rejected,
        bg: t.rejectedBg,
        title: 'Evidence rejected',
        sub: 'Your photo could not be verified.',
      },
    };
    const meta = metaByStatus[current];

    const reviewDone = current !== 'pending';
    const finalOk = current === 'verified';
    const finalBad = current === 'rejected';

    const finalIcon: IoniconName = finalOk
      ? 'checkmark-circle-outline'
      : finalBad
      ? 'close-circle-outline'
      : 'ellipse-outline';

    return (
      <>
        <View style={s.successWrap}>
          <View style={[s.successCircle, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon} size={44} color={meta.color} />
          </View>
          <Text style={s.successTitle}>{meta.title}</Text>
          <Text style={s.successSub}>{meta.sub}</Text>
        </View>

        <View style={{ height: 8 }} />
        <StreakBanner streak={12} doneToday />
                <Text style={[s.successSub, { marginTop: 14 }]}>
          {visibility === 'community'
            ? 'Shared with the challenge community 🏆'
            : 'Saved privately to your submissions log 🔒'}
        </Text>

        <Text style={s.sectionTitle}>Verification status</Text>
        <View style={s.tlCard}>
          <TimelineRow
            s={s}
            icon="paper-plane-outline"
            color={STATUS_COLORS.verified}
            bg={t.verifiedBg}
            title="Submitted"
            sub={submittedAt ? `Today, ${submittedAt}` : 'Evidence received'}
          />
          <TimelineRow
            s={s}
            icon={reviewDone ? 'eye-outline' : 'time-outline'}
            color={reviewDone ? STATUS_COLORS.verified : STATUS_COLORS.pending}
            bg={reviewDone ? t.verifiedBg : t.pendingBg}
            pulse={!reviewDone}
            title="Under review"
            sub={reviewDone ? 'Review completed' : 'Usually within 24 hours'}
          />
          <TimelineRow
            s={s}
            last
            icon={finalIcon}
            color={finalOk ? STATUS_COLORS.verified : finalBad ? STATUS_COLORS.rejected : t.sub}
            bg={finalOk ? t.verifiedBg : finalBad ? t.rejectedBg : t.cardSoft}
            title={finalBad ? 'Rejected' : 'Verified'}
            sub={
              finalOk
                ? '+50 points added to your profile'
                : finalBad
                ? 'Reason: the photo was not clear enough.'
                : 'Waiting for review'
            }
          />
        </View>

        {current === 'rejected' && (
          <TouchableOpacity style={s.retryBtn} onPress={vm.retry}>
            <Ionicons name="camera-outline" size={18} color={t.primary} />
            <Text style={s.retryText}>Upload new photo</Text>
          </TouchableOpacity>
        )}

        <Pressable style={s.uploadBtn} onPress={onBack}>
          <Text style={s.uploadBtnText}>Done</Text>
        </Pressable>

        <EvidenceHistory
  records={challengeRecords}
  onDelete={history.remove}
  onToggleVisibility={history.toggleVisibility}
/>

        {__DEV__ && (
          <View style={s.devRow}>
            <Text style={s.devLabel}>Preview status:</Text>
            {(['pending', 'verified', 'rejected'] as const).map((k) => (
              <TouchableOpacity
                key={k}
                style={[s.devChip, current === k && { backgroundColor: t.primary }]}
                onPress={() => setStatus(k)}
              >
                <Text style={[s.devChipText, current === k && { color: '#fff' }]}>{k}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </>
    );
  };

  const slide = enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {renderHeader()}

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <BrandHeader />
        <Animated.View style={{ opacity: enter, transform: [{ translateY: slide }] }}>
          {status ? renderDone(status) : renderForm()}
        </Animated.View>
      </ScrollView>

      {/* Bottom sheet */}
      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={s.overlay} onPress={() => setSheet(false)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Add workout photo</Text>

          <TouchableOpacity style={s.sheetRow} onPress={() => chooseSource(vm.takePhoto)}>
            <View style={s.sheetIcon}>
              <Ionicons name="camera-outline" size={22} color={t.primary} />
            </View>
            <Text style={s.sheetRowText}>Take photo</Text>
            <Ionicons name="chevron-forward" size={18} color={t.sub} />
          </TouchableOpacity>

          <TouchableOpacity style={s.sheetRow} onPress={() => chooseSource(vm.pickPhoto)}>
            <View style={s.sheetIcon}>
              <Ionicons name="images-outline" size={22} color={t.primary} />
            </View>
            <Text style={s.sheetRowText}>Choose from gallery</Text>
            <Ionicons name="chevron-forward" size={18} color={t.sub} />
          </TouchableOpacity>

          <TouchableOpacity style={s.sheetCancel} onPress={() => setSheet(false)}>
            <Text style={s.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}