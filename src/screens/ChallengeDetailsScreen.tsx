import React, { useRef, useState } from 'react';
import { View, Text, Animated, Pressable, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { NATIVE } from '../theme/motion';
import BottomNav from '../components/BottomNav';
import ChallengeHero from '../components/ChallengeHero';
import CountdownBlock from '../components/CountdownBlock';
import StatTile from '../components/StatTile';
import SegmentTabs from '../components/SegmentTabs';
import InfoRow from '../components/InfoRow';
import ConfirmSheet from '../components/ConfirmSheet';
import MyProgressCard from '../components/MyProgressCard';
import CommunityTab from '../components/CommunityTab';
import FadeInUp from '../components/FadeInUp';
import { RulesCard, WhyJoin } from '../components/RulesCard';
import { CHALLENGE_IMAGES } from '../data/challengeImages';
import { CHALLENGE_TABS, useChallengeViewModel } from '../viewmodels/useChallengeViewModel';

interface Props {
  challengeId: string;
  activeScreen: string;
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onSubmitProof: (challengeId: string, challengeTitle: string) => void;
}

export default function ChallengeDetailsScreen({
  challengeId,
  activeScreen,
  onBack,
  onNavigate,
  onSubmitProof,
}: Props) {
  const { colors } = useTheme();
  const { challenge: c, joined, toggleJoin, tab, setTab, days, toggleDay } =
    useChallengeViewModel(challengeId);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const [saved, setSaved] = useState(false); // shared by the hero heart and the Save button

  const scrollY = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: NATIVE,
  });

  const joinScale = useRef(new Animated.Value(1)).current;
  const pressTo = (v: number) =>
    Animated.spring(joinScale, { toValue: v, useNativeDriver: NATIVE, speed: 40 }).start();

  const onJoinPress = () => {
    if (joined) setConfirmWithdraw(true);
    else toggleJoin();
  };

  const category = c.category;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <ChallengeHero
          onBack={onBack}
          scrollY={scrollY}
          category={category}
          image={CHALLENGE_IMAGES[category]}
          title={c.title}
          description={c.description}
          durationDays={c.durationDays}
          level={String(c.level)}
          participants={c.participants}
          liked={saved}
          onToggleLike={() => setSaved((v) => !v)}
        />

        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <FadeInUp delay={100}>
            <View style={styles.ctaRow}>
              <Animated.View style={{ flex: 1, transform: [{ scale: joinScale }] }}>
                <Pressable
                  onPress={onJoinPress}
                  onPressIn={() => pressTo(0.97)}
                  onPressOut={() => pressTo(1)}
                  style={[
                    styles.cta,
                    joined
                      ? { borderWidth: 2, borderColor: colors.primary }
                      : { backgroundColor: colors.lime },
                  ]}
                >
                  <Text style={[styles.ctaText, { color: joined ? colors.primary : '#171326' }]}>
                    {joined ? 'Withdraw' : 'Join Challenge'}
                  </Text>
                  {!joined && <Ionicons name="arrow-forward" size={20} color="#171326" />}
                </Pressable>
              </Animated.View>

              <Pressable
                onPress={() => setSaved((v) => !v)}
                style={[styles.saveBtn, { borderColor: colors.primary }]}
              >
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.saveText, { color: colors.primary }]}>
                  {saved ? 'Saved' : 'Save'}
                </Text>
              </Pressable>
            </View>

            {joined && (
              <Pressable
                onPress={() => onSubmitProof(challengeId, c.title)}
                style={[styles.proofBtn, { borderColor: colors.primary }]}
              >
                <Ionicons name="camera-outline" size={20} color={colors.primary} />
                <Text style={[styles.proofText, { color: colors.primary }]}>Submit today's proof</Text>
              </Pressable>
            )}
          </FadeInUp>

          {joined && (
            <FadeInUp>
              <MyProgressCard
                durationDays={c.durationDays}
                elapsedDays={c.elapsedDays}
                reward={c.reward}
                done={days}
                onToggle={toggleDay}
              />
            </FadeInUp>
          )}

          <FadeInUp delay={200} style={styles.block}>
            <CountdownBlock
              {...c.endsIn}
              elapsedDays={c.elapsedDays}
              durationDays={c.durationDays}
            />
          </FadeInUp>

          <FadeInUp delay={280} style={styles.statsRow}>
            <StatTile icon="calendar" value={`${c.durationDays}`} label="Days" />
            <StatTile icon="walk" value={c.target} label="Daily target" />
            <StatTile icon="trophy" value={c.reward} label="Reward" highlight />
          </FadeInUp>

          <FadeInUp delay={360} style={styles.block}>
            <SegmentTabs tabs={CHALLENGE_TABS} active={tab} onChange={setTab} />
          </FadeInUp>

          <View style={styles.tabContent}>
            {tab === 'Rules' && (
              <>
                <RulesCard rules={c.rules} />
                <WhyJoin />
              </>
            )}
            {tab === 'Details' && c.details.map((d) => <InfoRow key={d.title} {...d} />)}
            {tab === 'Rewards' && c.rewards.map((r) => <InfoRow key={r.title} {...r} />)}
            {tab === 'Community' && <CommunityTab challengeTitle={c.title} />}
          </View>
        </View>
      </Animated.ScrollView>

      <BottomNav
        colors={colors}
        activeScreen={activeScreen}
        onNavigate={onNavigate}
      />

      <ConfirmSheet
        visible={confirmWithdraw}
        title="Withdraw from this challenge?"
        message="Your progress in this challenge will be lost and you'll need to join again to continue."
        confirmLabel="Yes, withdraw"
        onCancel={() => setConfirmWithdraw(false)}
        onConfirm={() => {
          setConfirmWithdraw(false);
          toggleJoin();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 40,
  },
  ctaRow: { flexDirection: 'row', gap: 12 },
  cta: {
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { fontSize: 17, fontWeight: '800' },
  saveBtn: {
    width: 128,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: { fontSize: 16, fontWeight: '800' },
  proofBtn: {
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  proofText: { fontSize: 15, fontWeight: '800' },
  block: { marginTop: 18 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  tabContent: { marginTop: 16 },
});