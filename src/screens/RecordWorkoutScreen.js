
import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import useRecordWorkoutViewModel from '../viewmodels/RecordWorkoutViewModel';

export default function RecordWorkoutScreen({
  colors,
  darkMode,
  onBack,
  onNavigate,
}) {
  const vm = useRecordWorkoutViewModel();

  const formatDate = (value) => {
    const [year, month, day] = value.split('-');
    return `${year}-${month}-${day}`;
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Record Workout
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Track your effort and keep your streak alive
            </Text>
          </View>
        </View>

        {/* Workout type */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionIcon}>⚒</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Workout Type
              </Text>
              <Text style={[styles.helper, { color: colors.muted }]}>
                Select your workout type
              </Text>
            </View>
          </View>

          <View style={styles.typeGrid}>
            {vm.workoutTypes.map((item) => {
              const selected = vm.workoutType === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => vm.setWorkoutType(item.id)}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.background,
                      borderColor: colors.track,
                    },
                  ]}
                >
                  <Text style={styles.typeIcon}>{item.icon}</Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.typeLabel,
                      { color: selected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.banner}>
            <Text style={styles.bannerEmoji}>
              {vm.workoutTypes.find((item) => item.id === vm.workoutType)?.icon}
            </Text>
            <View style={styles.bannerTextBox}>
              <Text style={styles.bannerTitle}>{vm.workoutType}</Text>
              <Text style={styles.bannerSubtitle}>
                Every workout counts. Keep going!
              </Text>
            </View>
            <Text style={styles.bannerRunner}>🏃</Text>
          </View>
        </View>

        {/* Duration */}
        <View style={[styles.card, styles.compactCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionIcon}>◷</Text>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Duration
              </Text>
              <Text style={[styles.helper, { color: colors.muted }]}>
                How long did you work out?
              </Text>
            </View>
          </View>

          <View style={styles.durationControls}>
            <TouchableOpacity
              accessibilityLabel="Decrease workout duration"
              onPress={() => vm.updateDuration(-5)}
              style={[styles.durationButton, { backgroundColor: colors.track }]}
            >
              <Text style={[styles.durationButtonText, { color: colors.primary }]}>
                −
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.durationValueBox,
                { borderColor: colors.track, backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.durationValue, { color: colors.text }]}>
                {vm.duration}
              </Text>
              <Text style={[styles.durationUnit, { color: colors.muted }]}>
                minutes
              </Text>
            </View>

            <TouchableOpacity
              accessibilityLabel="Increase workout duration"
              onPress={() => vm.updateDuration(5)}
              style={[styles.durationButton, { backgroundColor: colors.track }]}
            >
              <Text style={[styles.durationButtonText, { color: colors.primary }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date */}
        <View style={[styles.card, styles.inputCard, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionIcon}>▦</Text>
          <View style={styles.inputContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Date
            </Text>
            <TextInput
              value={vm.date}
              onChangeText={vm.setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.track,
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              accessibilityLabel="Workout date, YYYY-MM-DD"
            />
          </View>
        </View>

        {/* Notes */}
        <View style={[styles.card, styles.inputCard, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionIcon}>▤</Text>
          <View style={styles.inputContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Notes
            </Text>
            <TextInput
              value={vm.notes}
              onChangeText={vm.setNotes}
              placeholder="How did your workout feel?"
              placeholderTextColor={colors.muted}
              multiline
              maxLength={300}
              style={[
                styles.textInput,
                styles.notesInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.track,
                  color: colors.text,
                },
              ]}
              accessibilityLabel="Workout notes"
            />
            <Text style={[styles.characterCount, { color: colors.muted }]}>
              {vm.notes.length}/300
            </Text>
          </View>
        </View>

        {/* Effort */}
        <View style={[styles.card, styles.compactCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionIcon}>▥</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Effort Level
            </Text>
          </View>

          <View style={styles.effortRow}>
            {vm.effortLevels.map((item) => {
              const selected = vm.effort === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => vm.setEffort(item.id)}
                  style={[
                    styles.effortButton,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.background,
                      borderColor: colors.track,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.effortDot,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.effortText,
                      { color: selected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Calories */}
        <View
          style={[
            styles.caloriesCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.lime,
            },
          ]}
        >
          <View style={styles.caloriesIconBox}>
            <Text style={{ fontSize: 26 }}>🔥</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.caloriesTitle, { color: colors.text }]}>
              Estimated Calories
            </Text>
            <Text style={[styles.helper, { color: colors.muted }]}>
              Based on duration and type
            </Text>
          </View>

          <View style={styles.caloriesValueBox}>
            <Text style={[styles.caloriesValue, { color: colors.text }]}>
              {vm.calories}
            </Text>
            <Text style={[styles.helper, { color: colors.muted }]}>
              calories
            </Text>
          </View>
        </View>

        {vm.error ? (
          <Text accessibilityRole="alert" style={styles.errorText}>
            {vm.error}
          </Text>
        ) : null}

        {vm.message ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{vm.message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={vm.saveWorkout}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.saveButtonText}>
            {vm.editingId ? 'Update Workout  ✓' : 'Save Workout  →'}
          </Text>
        </TouchableOpacity>

        {/* Saved workouts */}
        {vm.workouts.length > 0 && (
          <View style={styles.savedSection}>
            <View style={styles.savedHeader}>
              <Text style={[styles.savedTitle, { color: colors.text }]}>
                Saved Workouts
              </Text>

              <TouchableOpacity onPress={vm.resetForm}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  New
                </Text>
              </TouchableOpacity>
            </View>

            {vm.workouts.map((workout) => (
              <View
                key={workout.id}
                style={[
                  styles.savedWorkout,
                  { backgroundColor: colors.card },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.savedWorkoutTitle, { color: colors.text }]}>
                    {workout.type} · {workout.duration} min
                  </Text>
                  <Text style={[styles.helper, { color: colors.muted }]}>
                    {formatDate(workout.date)} · {workout.calories} estimated kcal
                  </Text>
                  {workout.notes ? (
                    <Text style={[styles.savedNotes, { color: colors.muted }]}>
                      {workout.notes}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity onPress={() => vm.editWorkout(workout)}>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View
        style={[
          styles.bottomNav,
          { backgroundColor: colors.card, borderColor: colors.track },
        ]}
      >
        <TouchableOpacity style={styles.navItem} onPress={onBack}>
          <Text style={[styles.navIcon, { color: colors.muted }]}>⌂</Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('Challenges')}
        >
          <Text style={[styles.navIcon, { color: colors.muted }]}>⚑</Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Challenges
          </Text>
        </TouchableOpacity>

        <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.addText}>＋</Text>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('Leaderboard')}
        >
          <Text style={[styles.navIcon, { color: colors.muted }]}>▥</Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Leaderboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('Profile')}
        >
          <Text style={[styles.navIcon, { color: colors.muted }]}>◉</Text>
          <Text style={[styles.navLabel, { color: colors.muted }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 22 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backButton: { width: 28, marginRight: 7 },
  backIcon: { fontSize: 38, lineHeight: 42 },
  headerText: { flex: 1 },
  heading: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 11, marginTop: 4 },
  card: { borderRadius: 18, padding: 13, marginBottom: 11 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: { fontSize: 23, color: '#A38DF2', width: 27, textAlign: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '800' },
  helper: { fontSize: 11, marginTop: 4 },
  typeGrid: { flexDirection: 'row', gap: 7, marginTop: 14 },
  typeButton: {
    flex: 1, minWidth: 0, height: 76, borderWidth: 1,
    borderRadius: 13, alignItems: 'center', justifyContent: 'center', gap: 7,
    paddingHorizontal: 2,
  },
  typeIcon: { fontSize: 24 },
  typeLabel: { fontSize: 10, fontWeight: '700' },
  banner: {
    height: 95, borderRadius: 14, backgroundColor: '#6340B9',
    marginTop: 11, overflow: 'hidden', flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 12,
  },
  bannerEmoji: { fontSize: 45 },
  bannerTextBox: { flex: 1, marginLeft: 9 },
  bannerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  bannerSubtitle: { color: '#F1E9FF', fontSize: 10, marginTop: 5 },
  bannerRunner: { fontSize: 35 },
  compactCard: { paddingVertical: 13 },
  durationControls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, marginTop: 12,
  },
  durationButton: {
    width: 55, height: 49, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  durationButtonText: { fontSize: 29, lineHeight: 34 },
  durationValueBox: {
    width: 110, height: 49, borderWidth: 1, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  durationValue: { fontSize: 23, fontWeight: '800' },
  durationUnit: { fontSize: 10 },
  inputCard: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  inputContent: { flex: 1 },
  textInput: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 12,
    paddingVertical: 10, marginTop: 8, fontSize: 12, minHeight: 42,
  },
  notesInput: { minHeight: 68, textAlignVertical: 'top' },
  characterCount: { fontSize: 10, textAlign: 'right', marginTop: 4 },
  effortRow: { flexDirection: 'row', gap: 7, marginTop: 12 },
  effortButton: {
    flex: 1, minWidth: 0, height: 42, borderRadius: 12, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingHorizontal: 2,
  },
  effortDot: { width: 9, height: 9, borderRadius: 5 },
  effortText: { fontSize: 10, fontWeight: '700' },
  caloriesCard: {
    borderRadius: 17, borderWidth: 1, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12,
  },
  caloriesIconBox: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: '#E9F7B8',
    alignItems: 'center', justifyContent: 'center',
  },
  caloriesTitle: { fontSize: 12, fontWeight: '800' },
  caloriesValueBox: { alignItems: 'flex-end' },
  caloriesValue: { fontSize: 23, fontWeight: '800' },
  errorText: { color: '#FF6B6B', fontSize: 12, marginBottom: 10 },
  successBox: {
    backgroundColor: '#DFF6C3', borderRadius: 10, padding: 10, marginBottom: 10,
  },
  successText: { color: '#285A23', fontSize: 12, fontWeight: '700' },
  saveButton: {
    minHeight: 51, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginBottom: 22,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  savedSection: { marginBottom: 20 },
  savedHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  savedTitle: { fontSize: 17, fontWeight: '800' },
  savedWorkout: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 12, marginBottom: 8,
  },
  savedWorkoutTitle: { fontSize: 13, fontWeight: '800' },
  savedNotes: { fontSize: 11, marginTop: 5 },
  bottomNav: {
    minHeight: 60, borderTopWidth: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-around',
    paddingHorizontal: 5, paddingVertical: 5,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 23, lineHeight: 28, fontWeight: '700' },
  navLabel: { fontSize: 9 },
  addButton: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 3,
  },
  addText: { color: '#FFFFFF', fontSize: 29, lineHeight: 34 },
});
