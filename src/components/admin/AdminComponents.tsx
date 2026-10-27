import React, { useEffect, useState } from 'react';
import {
  Animated,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Colors } from '../../theme/Color';
import type { AdminViewModel } from '../../viewmodels/AdminViewModel';
import { getInitials } from '../../models/AdminModel';
import type { AdminDestination, AdminProfile, AdminScreen } from '../../models/AdminModel';

export interface AdminScreenProps {
  colors: Colors;
  darkMode: boolean;
  onToggleTheme: () => void;
  // Admin screens, or 'Home' to leave the admin area.
  onNavigate: (screen: AdminDestination) => void;
  onBack: () => void;
  vm: AdminViewModel;
}
type ContentProps = { colors: Colors; children: React.ReactNode };

// From this width up (web, tablets) the menu is a permanent sidebar and the
// dashboard uses the multi-column layout. Narrower screens use the drawer.
export const WIDE_SCREEN_WIDTH = 1000;
export function useIsWide(): boolean {
  return useWindowDimensions().width >= WIDE_SCREEN_WIDTH;
}

// Text colour that stays readable on the lime background in both themes.
const DARK_TEXT = '#171326';

/* ---------- Small building blocks ---------- */

export function AdminCard({ colors, children }: ContentProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
}

export function AdminText({
  colors,
  children,
  heading = false,
}: ContentProps & { heading?: boolean }) {
  return (
    <Text style={[heading ? styles.heading : styles.body, { color: colors.text }]}>
      {children}
    </Text>
  );
}

export function AdminButton({
  colors,
  title,
  onPress,
  variant = 'primary',
}: {
  colors: Colors;
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'lime' | 'secondary';
}) {
  const backgroundColor =
    variant === 'lime' ? colors.lime : variant === 'primary' ? colors.primary : colors.track;
  const color =
    variant === 'lime' ? DARK_TEXT : variant === 'primary' ? '#FFFFFF' : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor, opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </Pressable>
  );
}

// The label is always shown as text, so colour is never the only signal.
export function StatusBadge({ colors, label }: { colors: Colors; label: string }) {
  let backgroundColor = colors.track;
  let color = colors.text;
  if (label === 'Active' || label === 'Reviewed') {
    backgroundColor = colors.lime;
    color = DARK_TEXT;
  } else if (label === 'Needs review' || label === 'Suspended') {
    backgroundColor = colors.lavender;
    color = DARK_TEXT;
  }
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// Compact statistic card. `highlight` paints it lime; `fullWidth` is used on narrow phones.
export function StatCard({
  colors,
  value,
  label,
  hint,
  highlight = false,
  fullWidth = false,
}: {
  colors: Colors;
  value: string;
  label: string;
  hint?: string;
  highlight?: boolean;
  fullWidth?: boolean;
}) {
  const textColor = highlight ? DARK_TEXT : colors.text;
  const hintColor = highlight ? DARK_TEXT : colors.muted;
  return (
    <View
      style={[
        styles.stat,
        fullWidth && styles.statFullWidth,
        { backgroundColor: highlight ? colors.lime : colors.card },
      ]}
    >
      <Text style={[styles.number, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
      {hint ? <Text style={[styles.statHint, { color: hintColor }]}>{hint}</Text> : null}
    </View>
  );
}

export function ProgressBar({
  colors,
  value,
  label = 'Completion rate',
}: {
  colors: Colors;
  value: number;
  label?: string;
}) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[styles.track, { backgroundColor: colors.track }]}
    >
      <View
        style={[styles.fill, { backgroundColor: colors.lavender, width: `${percent}%` }]}
      />
    </View>
  );
}

// A label with its count on one line and a progress bar underneath.
export function ProgressRow({
  colors,
  label,
  countText,
  value,
}: {
  colors: Colors;
  label: string;
  countText: string;
  value: number;
}) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressText}>
        <Text style={[styles.progressLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.progressCount, { color: colors.text }]}>{countText}</Text>
      </View>
      <ProgressBar colors={colors} value={value} label={label} />
    </View>
  );
}

// Card title with an optional small shortcut button on the right.
export function SectionHeader({
  colors,
  title,
  actionLabel,
  onAction,
}: {
  colors: Colors;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [
            styles.linkButton,
            { backgroundColor: colors.track, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.linkText, { color: colors.text }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function AdminInput({
  colors,
  label,
  error,
  ...props
}: TextInputProps & { colors: Colors; label: string; error?: string }) {
  return (
    <View style={styles.field}>
      <AdminText colors={colors}>{label}</AdminText>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.background, borderColor: colors.lavender },
          props.multiline && styles.multiline,
        ]}
      />
      {error ? (
        <Text accessibilityRole="alert" style={[styles.body, { color: colors.text }]}>
          ⚠ {error}
        </Text>
      ) : null}
    </View>
  );
}

export function EmptyState({ colors, message }: { colors: Colors; message: string }) {
  return (
    <AdminCard colors={colors}>
      <AdminText colors={colors} heading>
        Nothing here yet
      </AdminText>
      <AdminText colors={colors}>{message}</AdminText>
    </AdminCard>
  );
}

// Round profile picture: the admin's photo if there is one, otherwise their initials.
export function AdminAvatar({
  colors,
  admin,
  size = 40,
}: {
  colors: Colors;
  admin: AdminProfile;
  size?: number;
}) {
  const round = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${admin.name}, ${admin.role}`}
      style={[styles.avatarRing, round, { backgroundColor: colors.lime, borderColor: colors.lavender }]}
    >
      {admin.imageUri ? (
        <Image source={{ uri: admin.imageUri }} style={round} />
      ) : (
        <Text style={[styles.avatarInitials, { fontSize: size * 0.4 }]}>
          {getInitials(admin.name)}
        </Text>
      )}
    </View>
  );
}

/* ---------- Side navigation drawer ---------- */

// The three admin destinations shown in the drawer.
const menuItems: { screen: AdminScreen; icon: string }[] = [
  { screen: 'Admin Dashboard', icon: '📊' },
  { screen: 'Manage Challenges', icon: '🏆' },
  { screen: 'Manage Users & Reports', icon: '👥' },
];

function DrawerItem({
  colors,
  icon,
  label,
  selected = false,
  onPress,
}: {
  colors: Colors;
  icon: string;
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.drawerItem,
        { backgroundColor: selected ? colors.primary : 'transparent', opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={styles.drawerIcon}>{icon}</Text>
      <Text
        style={[styles.drawerLabel, { color: selected ? '#FFFFFF' : colors.text }]}
      >
        {label}
      </Text>
      {/* Lime dot marks the current page (the label and fill also change). */}
      {selected ? <View style={[styles.drawerDot, { backgroundColor: colors.lime }]} /> : null}
    </Pressable>
  );
}

// The menu items, shared by the phone drawer and the wide-screen sidebar.
function AdminMenu({
  colors,
  activeScreen,
  onChoose,
}: {
  colors: Colors;
  activeScreen: AdminScreen;
  onChoose: (destination: AdminDestination) => void;
}) {
  return (
    <>
      {menuItems.map(item => (
        <DrawerItem
          key={item.screen}
          colors={colors}
          icon={item.icon}
          label={item.screen}
          selected={item.screen === activeScreen}
          onPress={() => onChoose(item.screen)}
        />
      ))}
      <View style={[styles.drawerDivider, { backgroundColor: colors.track }]} />
      <DrawerItem colors={colors} icon="🏠" label="Back to Home" onPress={() => onChoose('Home')} />
    </>
  );
}

// Permanent left sidebar for wide screens.
function AdminSidebar({
  colors,
  admin,
  activeScreen,
  onNavigate,
}: {
  colors: Colors;
  admin: AdminProfile;
  activeScreen: AdminScreen;
  onNavigate: (screen: AdminDestination) => void;
}) {
  return (
    <View style={[styles.sidebar, { backgroundColor: colors.card, borderRightColor: colors.track }]}>
      <ScrollView contentContainerStyle={styles.drawerContent}>
        <View style={styles.profile}>
          <AdminAvatar colors={colors} admin={admin} size={64} />
          <Text style={[styles.drawerTitle, { color: colors.text }]}>{admin.name}</Text>
          <Text style={[styles.statHint, { color: colors.muted }]}>{admin.role}</Text>
        </View>
        <Text style={[styles.menuGroup, { color: colors.text }]}>Navigation</Text>
        <AdminMenu
          colors={colors}
          activeScreen={activeScreen}
          onChoose={destination => {
            if (destination !== activeScreen) onNavigate(destination);
          }}
        />
      </ScrollView>
    </View>
  );
}

// Slide-in menu shown over the current screen. Not a screen itself.
export function AdminDrawer({
  colors,
  admin,
  visible,
  activeScreen,
  onClose,
  onNavigate,
}: {
  colors: Colors;
  admin: AdminProfile;
  visible: boolean;
  activeScreen: AdminScreen;
  onClose: () => void;
  onNavigate: (screen: AdminDestination) => void;
}) {
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.84, 320);
  // 0 = closed, 1 = open. Drives both the slide and the dimmed backdrop.
  const [progress] = useState(() => new Animated.Value(0));

  // Slide the menu in each time it is opened.
  useEffect(() => {
    if (visible) {
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 220, useNativeDriver: false }).start();
    }
  }, [visible, progress]);

  // Every way of closing (backdrop, X button, Android Back, choosing an item)
  // slides the menu out first, then runs `afterClose`.
  function closeMenu(afterClose?: () => void) {
    Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: false }).start(({ finished }) => {
      if (!finished) return;
      onClose();
      if (afterClose) afterClose();
    });
  }

  function choose(destination: AdminDestination) {
    // Choosing the page you are already on only closes the menu.
    closeMenu(destination === activeScreen ? undefined : () => onNavigate(destination));
  }

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-drawerWidth, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => closeMenu()}
    >
      <View style={styles.drawerRoot}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close menu"
            onPress={() => closeMenu()}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.drawerPanel,
            { width: drawerWidth, backgroundColor: colors.card, transform: [{ translateX }] },
          ]}
        >
          <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.drawerContent}>
              <View style={styles.drawerHeader}>
                <AdminAvatar colors={colors} admin={admin} size={48} />
                <View style={styles.drawerBrand}>
                  <Text style={[styles.drawerTitle, { color: colors.text }]}>{admin.name}</Text>
                  <Text style={[styles.statHint, { color: colors.muted }]}>{admin.role}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close menu"
                  onPress={() => closeMenu()}
                  style={[styles.iconButton, { backgroundColor: colors.track }]}
                >
                  <Text style={[styles.iconText, { color: colors.text }]}>✕</Text>
                </Pressable>
              </View>

              <AdminMenu colors={colors} activeScreen={activeScreen} onChoose={choose} />
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------- Wide-screen dashboard blocks ---------- */

// Tiny bar chart drawn with plain Views (no chart library).
export function MiniBars({ colors, values, label }: { colors: Colors; values: number[]; label: string }) {
  const tallest = Math.max(1, ...values);
  return (
    <View accessible accessibilityLabel={label} style={styles.miniBars}>
      {values.map((value, index) => (
        <View
          key={index}
          style={[
            styles.miniBar,
            { backgroundColor: colors.lavender, height: (value / tallest) * 56 },
          ]}
        />
      ))}
    </View>
  );
}

// Large statistic card: number, small chart and a coloured footer with three figures.
export function BigStatCard({
  colors,
  title,
  value,
  caption,
  chartValues,
  chartLabel,
  footer,
  footerColor,
}: {
  colors: Colors;
  title: string;
  value: string;
  caption: string;
  chartValues: number[];
  chartLabel: string;
  footer: { value: string; label: string }[];
  footerColor: string;
}) {
  return (
    <View style={[styles.bigCard, { backgroundColor: colors.card }]}>
      <View style={styles.bigTop}>
        <Text style={[styles.statLabel, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.bigNumber, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statHint, { color: colors.muted }]}>{caption}</Text>
        {chartValues.length > 0 ? (
          <MiniBars colors={colors} values={chartValues} label={chartLabel} />
        ) : null}
        <Text style={[styles.statHint, { color: colors.muted }]}>{chartLabel}</Text>
      </View>
      <View style={[styles.bigFooter, { backgroundColor: footerColor }]}>
        {footer.map(item => (
          <View key={item.label} style={styles.footerItem}>
            <Text style={styles.footerValue}>{item.value}</Text>
            <Text style={styles.footerLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Small statistic tile whose footer is a working shortcut.
export function StatTile({
  colors,
  value,
  label,
  actionLabel,
  footerColor,
  onPress,
}: {
  colors: Colors;
  value: string;
  label: string;
  actionLabel: string;
  footerColor: string;
  onPress: () => void;
}) {
  return (
    <View style={[styles.tile, { backgroundColor: colors.card }]}>
      <View style={styles.tileTop}>
        <Text style={[styles.tileNumber, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.tileLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.tileFooter,
          { backgroundColor: footerColor, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={[styles.tileFooterText, { color: footerColor === colors.track ? colors.text : DARK_TEXT }]}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

/* ---------- Page layout shared by all three admin screens ---------- */

export function AdminLayout({
  screen,
  subtitle,
  children,
  colors,
  darkMode,
  onToggleTheme,
  onNavigate,
  onBack,
  vm,
}: AdminScreenProps & { screen: AdminScreen; subtitle?: string; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isWide = useIsWide();

  // Android Back closes the menu first, otherwise it goes back as before.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menuOpen) {
        setMenuOpen(false);
      } else {
        onBack();
      }
      return true;
    });
    return () => subscription.remove();
  }, [menuOpen, onBack]);

  const feedbackNotice = vm.feedback ? (
    <View accessibilityLiveRegion="polite" style={[styles.notice, { backgroundColor: colors.lime }]}>
      <Text style={styles.feedback}>{vm.feedback}</Text>
      <AdminButton colors={colors} title="Dismiss message" variant="secondary" onPress={vm.clearFeedback} />
    </View>
  ) : null;

  // Wide screens: permanent sidebar on the left, coloured banner and cards on the right.
  if (isWide) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <View style={styles.wideRow}>
          <AdminSidebar colors={colors} admin={vm.admin} activeScreen={screen} onNavigate={onNavigate} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.flex}
            contentContainerStyle={styles.wideScroll}
          >
            <View style={[styles.banner, { backgroundColor: colors.primary }]}>
              <View style={[styles.bannerCircle, { backgroundColor: colors.lavender }]} />
              <AdminAvatar colors={colors} admin={vm.admin} size={52} />
              <View style={styles.bannerText}>
                <Text accessibilityRole="header" style={styles.bannerTitle}>
                  {screen}
                </Text>
                <Text style={styles.bannerSub}>{subtitle ?? 'Welcome back, Admin.'}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                onPress={onToggleTheme}
                style={styles.bannerToggle}
              >
                <Text style={styles.iconText}>{darkMode ? '☀️' : '🌙'}</Text>
              </Pressable>
            </View>
            <View style={styles.wideBody}>
              {feedbackNotice}
              {children}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      {/* Compact header stays visible while the page scrolls. */}
      <View style={[styles.headerBar, { borderBottomColor: colors.track }]}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => setMenuOpen(true)}
            style={[styles.iconButton, { backgroundColor: colors.track }]}
          >
            <View style={[styles.bar, { backgroundColor: colors.text }]} />
            <View style={[styles.bar, { backgroundColor: colors.text }]} />
            <View style={[styles.bar, { backgroundColor: colors.text }]} />
          </Pressable>
          <AdminAvatar colors={colors} admin={vm.admin} size={40} />
          <Text
            accessibilityRole="header"
            numberOfLines={2}
            style={[styles.headerTitle, { color: colors.text }]}
          >
            {screen}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onPress={onToggleTheme}
            style={[styles.iconButton, { backgroundColor: colors.track }]}
          >
            <Text style={styles.iconText}>{darkMode ? '☀️' : '🌙'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
        {subtitle ? <AdminText colors={colors}>{subtitle}</AdminText> : null}
        {vm.feedback ? (
          <View
            accessibilityLiveRegion="polite"
            style={[styles.notice, { backgroundColor: colors.lime }]}
          >
            <Text style={styles.feedback}>{vm.feedback}</Text>
            <AdminButton
              colors={colors}
              title="Dismiss message"
              variant="secondary"
              onPress={vm.clearFeedback}
            />
          </View>
        ) : null}
        {children}
      </ScrollView>

      <AdminDrawer
        colors={colors}
        admin={vm.admin}
        visible={menuOpen}
        activeScreen={screen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </SafeAreaView>
  );
}

/* ---------- Modals (forms, details and confirmations) ---------- */

export function AdminModal({
  colors,
  title,
  onClose,
  children,
}: ContentProps & { title: string; onClose: () => void }) {
  return (
    <Modal visible animationType="slide" onRequestClose={onClose} presentationStyle="fullScreen">
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
            <AdminButton
              colors={colors}
              title="Cancel / Close"
              variant="secondary"
              onPress={onClose}
            />
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

export function ConfirmModal({
  colors,
  title,
  message,
  action,
  onConfirm,
  onClose,
}: {
  colors: Colors;
  title: string;
  message: string;
  action: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AdminModal colors={colors} title={title} onClose={onClose}>
      <AdminCard colors={colors}>
        <AdminText colors={colors}>{message}</AdminText>
      </AdminCard>
      <AdminButton colors={colors} title={action} onPress={onConfirm} />
      <AdminButton colors={colors} title="Keep unchanged" variant="secondary" onPress={onClose} />
    </AdminModal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // Android needs manual top padding for the status bar; iOS SafeAreaView handles it.
  safe: { flex: 1, paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 24 : 0 },
  page: { padding: 16, paddingBottom: 40, gap: 12, width: '100%', maxWidth: 760, alignSelf: 'center' },

  // Header
  headerBar: { borderBottomWidth: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconText: { fontSize: 18, fontWeight: '700' },
  bar: { width: 20, height: 2.5, borderRadius: 2 },

  // Text and cards
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  heading: { fontSize: 18, fontWeight: '700', lineHeight: 25 },
  body: { fontSize: 14, lineHeight: 22 },
  card: { borderRadius: 20, padding: 16, gap: 12 },
  notice: { padding: 14, borderRadius: 14, gap: 10 },
  feedback: { color: DARK_TEXT, fontSize: 14, lineHeight: 22, fontWeight: '600' },

  // Buttons and badges
  button: { borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, minHeight: 48, justifyContent: 'center' },
  buttonText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  linkButton: { paddingHorizontal: 14, minHeight: 36, borderRadius: 18, justifyContent: 'center' },
  linkText: { fontSize: 13, fontWeight: '700' },

  // Statistic cards
  stat: { flexGrow: 1, flexBasis: '47%', borderRadius: 18, padding: 14, gap: 2 },
  statFullWidth: { flexBasis: '100%' },
  number: { fontSize: 28, fontWeight: '800', lineHeight: 34 },
  statLabel: { fontSize: 14, fontWeight: '700' },
  statHint: { fontSize: 12, lineHeight: 18 },

  // Progress
  track: { height: 10, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  progressRow: { gap: 6 },
  progressText: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  progressLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
  progressCount: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sectionTitle: { flex: 1, fontSize: 17, fontWeight: '700', lineHeight: 24 },

  // Form fields
  field: { gap: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, minHeight: 50 },
  multiline: { minHeight: 96, textAlignVertical: 'top' },

  // Wide layout
  wideRow: { flex: 1, flexDirection: 'row' },
  wideScroll: { paddingBottom: 40 },
  wideBody: { padding: 16, gap: 12, marginTop: -48, width: '100%', maxWidth: 1100, alignSelf: 'center' },
  sidebar: { width: 230, borderRightWidth: 1 },
  profile: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  avatarRing: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, overflow: 'hidden' },
  avatarInitials: { fontWeight: '800', color: DARK_TEXT },
  menuGroup: { fontSize: 13, fontWeight: '700', marginTop: 8, marginBottom: 4, paddingHorizontal: 6 },
  banner: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 72, flexDirection: 'row', alignItems: 'flex-start', gap: 12, overflow: 'hidden' },
  bannerCircle: { position: 'absolute', right: -40, top: -60, width: 220, height: 220, borderRadius: 110, opacity: 0.3 },
  bannerText: { flex: 1, gap: 4 },
  bannerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  bannerSub: { fontSize: 14, color: '#FFFFFF' },
  bannerToggle: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.25)' },
  bigCard: { flexGrow: 1, flexBasis: 240, borderRadius: 20, overflow: 'hidden' },
  bigTop: { padding: 16, gap: 4 },
  bigNumber: { fontSize: 36, fontWeight: '800', lineHeight: 42 },
  miniBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 60, marginTop: 8 },
  miniBar: { flex: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  bigFooter: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
  footerItem: { flex: 1, alignItems: 'center' },
  footerValue: { fontSize: 20, fontWeight: '800', color: DARK_TEXT },
  footerLabel: { fontSize: 12, fontWeight: '600', color: DARK_TEXT },
  tile: { flexGrow: 1, flexBasis: '47%', borderRadius: 18, overflow: 'hidden' },
  tileTop: { padding: 14, gap: 2 },
  tileNumber: { fontSize: 26, fontWeight: '800', lineHeight: 32 },
  tileLabel: { fontSize: 13, fontWeight: '700' },
  tileFooter: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 14 },
  tileFooterText: { fontSize: 12, fontWeight: '800', color: DARK_TEXT },

  // Drawer
  drawerRoot: { flex: 1, flexDirection: 'row' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 11, 31, 0.6)' },
  drawerPanel: {
    height: '100%',
    elevation: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 4, height: 0 },
  },
  drawerContent: { padding: 16, gap: 6, paddingBottom: 32 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  drawerBrand: { flex: 1, paddingHorizontal: 10 },
  drawerTitle: { fontSize: 20, fontWeight: '800' },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  drawerIcon: { fontSize: 18 },
  drawerLabel: { flex: 1, fontSize: 15, fontWeight: '700' },
  drawerDot: { width: 8, height: 8, borderRadius: 4 },
  drawerDivider: { height: 1, marginVertical: 8 },
});
