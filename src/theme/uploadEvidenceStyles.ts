import { Platform, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import type { Colors } from './Color';

export const STATUS_COLORS = {
  pending: '#F5A524',
  pendingBg: '#FFF3DC',
  verified: '#22A06B',
  verifiedBg: '#DDF5EA',
  rejected: '#F5484D',
  rejectedBg: '#FDE4E5',
} as const;

export const INK = '#14112B'; // text on lime buttons (always dark)

export interface Theme {
  bg: string;
  headerTop: string;
  card: string;
  cardSoft: string;
  primary: string;
  primaryDark: string;
  tint: string;
  text: string;
  sub: string;
  lime: string;
  border: string;
  pendingBg: string;
  verifiedBg: string;
  rejectedBg: string;
}

export const makeTheme = (c: Colors, isDark: boolean): Theme => ({
  bg: c.background,
  headerTop: isDark ? '#2E2450' : c.track,
  card: c.card,
  cardSoft: isDark ? '#2E2450' : c.track,
  primary: c.primary,
  primaryDark: '#4B2FD6',
  tint: isDark ? '#33285C' : c.track,
  text: c.text,
  sub: c.muted,
  lime: c.lime,
  border: isDark ? '#3A2F66' : c.track,
  pendingBg: isDark ? '#3D3220' : STATUS_COLORS.pendingBg,
  verifiedBg: isDark ? '#1E3A31' : STATUS_COLORS.verifiedBg,
  rejectedBg: isDark ? '#43262A' : STATUS_COLORS.rejectedBg,
});

export const shadow = (color: string, opacity = 0.18, radius = 14, y = 6): ViewStyle => ({
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: radius,
  shadowOffset: { width: 0, height: y },
  elevation: 4,
});

export const makeStyles = (t: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: t.bg,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },

    /* header */
    header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: t.card,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow(t.primary, 0.2, 10, 4),
    },
    backBtnGhost: { width: 42, height: 42 },
    headerCenter: { alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: t.text },
    headerSub: { fontSize: 12, color: t.sub, marginTop: 2 },

    /* steps */
    stepsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
    stepItem: { alignItems: 'center', gap: 6 },
    stepCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: t.border,
      backgroundColor: t.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNum: { fontSize: 12, fontWeight: '700', color: t.sub },
    stepLabel: { fontSize: 12, color: t.sub, fontWeight: '500' },
    stepLine: {
      flex: 1,
      height: 2,
      backgroundColor: t.border,
      marginHorizontal: 8,
      marginBottom: 20,
    },

    scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48 },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: t.text,
      marginTop: 24,
      marginBottom: 10,
    },

    /* workout card */
    workoutCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.card,
      borderRadius: 20,
      padding: 14,
      paddingLeft: 20,
      gap: 14,
      overflow: 'hidden',
      ...shadow(t.primary, 0.12, 12, 4),
    },
    workoutBar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 6,
      backgroundColor: t.primary,
    },
    workoutIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    workoutTitle: { fontSize: 16, fontWeight: '700', color: t.text },
    chipsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: t.tint,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    chipText: { fontSize: 12, color: t.primary, fontWeight: '600' },

    /* dropzone */
    dropzone: {
      backgroundColor: t.card,
      borderRadius: 24,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: t.primary,
      padding: 28,
      alignItems: 'center',
      overflow: 'hidden',
    },
    bubble: { position: 'absolute', borderRadius: 999, backgroundColor: t.tint, opacity: 0.6 },
    dropIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: t.tint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    dropTitle: { fontSize: 16, fontWeight: '700', color: t.text },
    dropSub: { fontSize: 13, color: t.sub, marginTop: 6 },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 13,
      paddingHorizontal: 26,
      borderRadius: 16,
    },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    /* preview */
    previewWrap: {
      borderRadius: 26,
      overflow: 'hidden',
      backgroundColor: t.card,
      ...shadow(t.primary, 0.28, 18, 8),
    },
    preview: { width: '100%', height: 280 },
    readyBadge: {
      position: 'absolute',
      left: 12,
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: t.lime,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    readyText: { fontSize: 12, fontWeight: '700', color: INK },
    removeBtn: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(20,17,43,0.65)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
    thumb: {
      width: 58,
      height: 58,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: 'transparent',
      overflow: 'hidden',
    },
    thumbImg: { width: '100%', height: '100%' },
    thumbAdd: {
      borderColor: t.primary,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.card,
    },
    thumbCount: { marginLeft: 'auto', fontSize: 13, color: t.sub, fontWeight: '600' },

    /* tip + points + note */
    tipCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: t.cardSoft,
      borderRadius: 16,
      padding: 12,
      marginTop: 16,
    },
    tipIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: t.tint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipText: { flex: 1, fontSize: 13, color: t.sub, lineHeight: 18 },
    input: {
      backgroundColor: t.card,
      borderRadius: 16,
      padding: 14,
      minHeight: 90,
      textAlignVertical: 'top',
      color: t.text,
      fontSize: 14,
    },
    pointsBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: t.lime,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
      marginTop: 18,
    },
    pointsText: { fontSize: 13, fontWeight: '700', color: INK },
    errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
    errorText: { fontSize: 13, color: STATUS_COLORS.rejected, fontWeight: '600' },

    /* progress */
    progressWrap: { marginTop: 18 },
    progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { fontSize: 13, color: t.sub, fontWeight: '600' },
    progressPct: { fontSize: 13, color: t.primary, fontWeight: '700' },
    progressTrack: { height: 10, borderRadius: 5, backgroundColor: t.tint, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 5, backgroundColor: t.primary },

    /* main button */
    uploadBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: t.lime,
      borderRadius: 18,
      paddingVertical: 16,
      marginTop: 22,
      ...shadow(t.lime, 0.55, 16, 6),
    },
    uploadBtnText: { fontSize: 16, fontWeight: '700', color: INK },

    /* success + timeline */
    successWrap: { alignItems: 'center', marginTop: 24 },
    successCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: { fontSize: 22, fontWeight: '800', color: t.text, marginTop: 16 },
    successSub: { fontSize: 14, color: t.sub, marginTop: 6, textAlign: 'center' },
    tlCard: {
      backgroundColor: t.card,
      borderRadius: 20,
      padding: 16,
      ...shadow(t.primary, 0.1, 12, 4),
    },
    tlRow: { flexDirection: 'row', gap: 14 },
    tlLeft: { alignItems: 'center' },
    tlDot: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tlLine: { width: 2, flex: 1, backgroundColor: t.border, marginVertical: 4, minHeight: 22 },
    tlBody: { flex: 1, paddingBottom: 18 },
    tlTitle: { fontSize: 15, fontWeight: '700', color: t.text },
    tlSub: { fontSize: 13, color: t.sub, marginTop: 2 },
    retryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: t.tint,
      borderRadius: 18,
      paddingVertical: 14,
      marginTop: 18,
    },
    retryText: { color: t.primary, fontWeight: '700', fontSize: 15 },

    devRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22, flexWrap: 'wrap' },
    devLabel: { fontSize: 12, color: t.sub },
    devChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: t.tint,
    },
    devChipText: { fontSize: 12, color: t.primary, fontWeight: '600' },

    /* bottom sheet */
    overlay: { flex: 1, backgroundColor: 'rgba(20,17,43,0.45)' },
    sheet: {
      backgroundColor: t.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 20,
      paddingBottom: 32,
    },
    sheetHandle: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: t.border,
      marginBottom: 16,
    },
    sheetTitle: { fontSize: 17, fontWeight: '700', color: t.text, marginBottom: 12 },
    sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
    sheetIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: t.tint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetRowText: { flex: 1, fontSize: 15, fontWeight: '600', color: t.text },
    sheetCancel: {
      marginTop: 10,
      alignItems: 'center',
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: t.cardSoft,
    },
    sheetCancelText: { fontSize: 15, fontWeight: '700', color: t.sub },
  });

export type Styles = ReturnType<typeof makeStyles>;