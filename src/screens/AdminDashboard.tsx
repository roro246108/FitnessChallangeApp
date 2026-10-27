import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AdminButton,
  AdminCard,
  AdminLayout,
  AdminText,
  BigStatCard,
  ProgressRow,
  SectionHeader,
  StatTile,
  StatusBadge,
  useIsWide,
} from '../components/admin/AdminComponents';
import type { AdminScreenProps } from '../components/admin/AdminComponents';

// How many challenges / reports to preview before sending the admin to the full screen.
const PREVIEW_CHALLENGES = 4;
const PREVIEW_REPORTS = 3;

type SectionProps = Pick<AdminScreenProps, 'colors' | 'vm' | 'onNavigate'>;

/* ---------- Sections shared by the phone and wide layouts ---------- */

function ParticipationCard({ colors, vm }: SectionProps) {
  const { stats } = vm;
  return (
    <AdminCard colors={colors}>
      <SectionHeader colors={colors} title="Participation summary" />
      {stats.entries === 0 ? (
        <AdminText colors={colors}>No one has joined a challenge yet.</AdminText>
      ) : (
        <>
          <ProgressRow
            colors={colors}
            label="Users taking part"
            countText={`${stats.participants} of ${stats.totalUsers}`}
            value={stats.participationRate}
          />
          <ProgressRow
            colors={colors}
            label="Entries completed"
            countText={`${stats.completed} of ${stats.entries}`}
            value={stats.completionRate}
          />
          <ProgressRow
            colors={colors}
            label="Entries in progress"
            countText={`${stats.inProgress} of ${stats.entries}`}
            value={stats.inProgressRate}
          />
          <Text style={[styles.note, { color: colors.muted }]}>
            Each user joining a challenge counts as one entry.
          </Text>
        </>
      )}
    </AdminCard>
  );
}

function ReportsCard({ colors, vm, onNavigate }: SectionProps) {
  const { stats } = vm;
  const shownReports = vm.pendingReports.slice(0, PREVIEW_REPORTS);
  const hiddenReports = vm.pendingReports.length - shownReports.length;

  // Open Users & Reports with the "Reported Accounts" filter already selected.
  function openPendingReports() {
    vm.showReportedAccounts();
    onNavigate('Manage Users & Reports');
  }

  return (
    <AdminCard colors={colors}>
      <SectionHeader colors={colors} title="Reports to review" />
      {stats.pendingReports === 0 ? (
        <AdminText colors={colors}>
          All caught up. {stats.reviewedReports}{' '}
          {stats.reviewedReports === 1 ? 'report has' : 'reports have'} been reviewed.
        </AdminText>
      ) : (
        <>
          <Text style={[styles.reportCount, { color: colors.text }]}>
            {stats.pendingReports} {stats.pendingReports === 1 ? 'report needs' : 'reports need'} review
          </Text>
          {shownReports.map((report, index) => (
            <View
              key={report.id}
              style={[
                styles.row,
                index > 0 && { borderTopWidth: 1, borderTopColor: colors.track },
              ]}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{report.userName}</Text>
                <Text style={[styles.note, { color: colors.muted }]}>
                  {report.reason} · {report.date}
                </Text>
              </View>
              <StatusBadge colors={colors} label="Needs review" />
            </View>
          ))}
          {hiddenReports > 0 ? (
            <Text style={[styles.note, { color: colors.muted }]}>
              + {hiddenReports} more {hiddenReports === 1 ? 'report' : 'reports'}
            </Text>
          ) : null}
          <AdminButton
            colors={colors}
            title="Review reports"
            variant="secondary"
            onPress={openPendingReports}
          />
        </>
      )}
    </AdminCard>
  );
}

function ShortcutsCard({ colors, onNavigate }: Pick<SectionProps, 'colors' | 'onNavigate'>) {
  return (
    <AdminCard colors={colors}>
      <SectionHeader colors={colors} title="Management shortcuts" />
      <AdminButton
        colors={colors}
        title="Manage Challenges"
        variant="lime"
        onPress={() => onNavigate('Manage Challenges')}
      />
      <AdminButton
        colors={colors}
        title="Manage Users & Reports"
        onPress={() => onNavigate('Manage Users & Reports')}
      />
    </AdminCard>
  );
}

/* ---------- Phone layout: one column, short challenge list ---------- */

function ChallengeListCard({ colors, vm, onNavigate }: SectionProps) {
  const shown = vm.challengeSummaries.slice(0, PREVIEW_CHALLENGES);
  const hidden = vm.challengeSummaries.length - shown.length;
  return (
    <AdminCard colors={colors}>
      <SectionHeader
        colors={colors}
        title="Challenge overview"
        actionLabel="View all"
        onAction={() => onNavigate('Manage Challenges')}
      />
      {shown.length === 0 ? (
        <AdminText colors={colors}>No challenges yet. Create one in Manage Challenges.</AdminText>
      ) : (
        shown.map((challenge, index) => (
          <View
            key={challenge.id}
            style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: colors.track }]}
          >
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{challenge.title}</Text>
              <Text style={[styles.note, { color: colors.muted }]}>
                {challenge.entries} joined · {challenge.completed} completed
              </Text>
            </View>
            <StatusBadge colors={colors} label={challenge.status} />
          </View>
        ))
      )}
      {hidden > 0 ? (
        <Text style={[styles.note, { color: colors.muted }]}>
          + {hidden} more {hidden === 1 ? 'challenge' : 'challenges'}
        </Text>
      ) : null}
    </AdminCard>
  );
}

function PhoneDashboard(props: SectionProps) {
  return (
    <>
      <DashboardStatistics {...props} />
      <ParticipationCard {...props} />
      <ChallengeListCard {...props} />
      <ReportsCard {...props} />
      <ShortcutsCard {...props} />
    </>
  );
}

/* ---------- Wide layout: like the reference dashboard ---------- */

function ChallengeTable({ colors, vm, onNavigate }: SectionProps) {
  const rows = vm.challengeSummaries;
  return (
    <View style={[styles.tableCard, { backgroundColor: colors.card }]}>
      <View style={styles.tableTitle}>
        <SectionHeader
          colors={colors}
          title="Challenges"
          actionLabel="Manage"
          onAction={() => onNavigate('Manage Challenges')}
        />
      </View>
      <View style={[styles.tableHead, { backgroundColor: colors.lavender }]}>
        <Text style={[styles.headText, styles.colName]}>Challenge</Text>
        <Text style={[styles.headText, styles.colNumber]}>Joined</Text>
        <Text style={[styles.headText, styles.colNumber]}>Done</Text>
        <Text style={[styles.headText, styles.colStatus]}>Status</Text>
      </View>
      {rows.length === 0 ? (
        <View style={styles.tableEmpty}>
          <AdminText colors={colors}>No challenges yet. Create one in Manage Challenges.</AdminText>
        </View>
      ) : (
        rows.map((challenge, index) => (
          <View
            key={challenge.id}
            style={[
              styles.tableRow,
              index > 0 && { borderTopWidth: 1, borderTopColor: colors.track },
            ]}
          >
            <View style={styles.colName}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{challenge.title}</Text>
              <Text style={[styles.note, { color: colors.muted }]}>
                {challenge.startDate} to {challenge.endDate}
              </Text>
            </View>
            <Text style={[styles.cellText, styles.colNumber, { color: colors.text }]}>
              {challenge.entries}
            </Text>
            <Text style={[styles.cellText, styles.colNumber, { color: colors.text }]}>
              {challenge.completed}
            </Text>
            <View style={styles.colStatus}>
              <StatusBadge colors={colors} label={challenge.status} />
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// Reuse the same viewmodel values and chart cards at every screen width.
function DashboardStatistics(props: SectionProps) {
  const { colors, vm, onNavigate } = props;
  const { stats } = vm;

  // Same action the "Review reports" button uses.
  function openPendingReports() {
    vm.showReportedAccounts();
    onNavigate('Manage Users & Reports');
  }

  return (
      <View style={styles.wideRow}>
        <BigStatCard
          colors={colors}
          title="Total users"
          value={String(stats.totalUsers)}
          caption="Accounts in the community"
          chartValues={vm.entriesPerUser}
          chartLabel="Challenges joined per user"
          footerColor={colors.lavender}
          footer={[
            { value: String(stats.activeUsers), label: 'Active' },
            { value: String(stats.suspendedUsers), label: 'Suspended' },
            { value: String(stats.participants), label: 'Taking part' },
          ]}
        />
        <BigStatCard
          colors={colors}
          title="Completion rate"
          value={`${stats.completionRate}%`}
          caption="Entries completed so far"
          chartValues={vm.completionByChallenge}
          chartLabel="Completion by challenge"
          footerColor={colors.lime}
          footer={[
            { value: String(stats.completed), label: 'Completed' },
            { value: String(stats.inProgress), label: 'In progress' },
            { value: String(stats.entries), label: 'Entries' },
          ]}
        />
        <View style={styles.tileGrid}>
          <StatTile
            colors={colors}
            value={String(stats.activeChallenges)}
            label="Active challenges"
            actionLabel="Manage challenges"
            footerColor={colors.lime}
            onPress={() => onNavigate('Manage Challenges')}
          />
          <StatTile
            colors={colors}
            value={String(stats.pendingReports)}
            label="Reports to review"
            actionLabel="Review reports"
            footerColor={colors.lavender}
            onPress={openPendingReports}
          />
          <StatTile
            colors={colors}
            value={String(stats.suspendedUsers)}
            label="Suspended accounts"
            actionLabel="View users"
            footerColor={colors.track}
            onPress={() => onNavigate('Manage Users & Reports')}
          />
          <StatTile
            colors={colors}
            value={String(stats.completedChallenges)}
            label="Completed challenges"
            actionLabel="View challenges"
            footerColor={colors.track}
            onPress={() => onNavigate('Manage Challenges')}
          />
        </View>
      </View>

  );
}

function WideDashboard(props: SectionProps) {
  return (
    <>
      <DashboardStatistics {...props} />
      {/* Row 2: challenge table and reports list */}
      <View style={styles.wideRow}>
        <View style={styles.wideMain}>
          <ChallengeTable {...props} />
        </View>
        <View style={styles.wideSide}>
          <ReportsCard {...props} />
        </View>
      </View>

      {/* Row 3: participation and shortcuts */}
      <View style={styles.wideRow}>
        <View style={styles.wideMain}>
          <ParticipationCard {...props} />
        </View>
        <View style={styles.wideSide}>
          <ShortcutsCard {...props} />
        </View>
      </View>
    </>
  );
}

export default function AdminDashboard(props: AdminScreenProps) {
  const isWide = useIsWide();
  const { colors, vm, onNavigate } = props;
  return (
    <AdminLayout {...props} screen="Admin Dashboard">
      {isWide ? (
        <WideDashboard colors={colors} vm={vm} onNavigate={onNavigate} />
      ) : (
        <PhoneDashboard colors={colors} vm={vm} onNavigate={onNavigate} />
      )}
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  note: { fontSize: 12, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 10 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: '700', lineHeight: 21 },
  reportCount: { fontSize: 15, fontWeight: '700' },

  // Wide layout: items wrap onto a new line when the window gets narrower.
  wideRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'stretch' },
  wideMain: { flexGrow: 2, flexBasis: 360 },
  wideSide: { flexGrow: 1, flexBasis: 260 },
  tileGrid: { flexGrow: 1, flexBasis: 280, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  // Challenge table
  tableCard: { borderRadius: 20, overflow: 'hidden', paddingBottom: 4 },
  tableTitle: { padding: 16, paddingBottom: 12 },
  tableHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  headText: { fontSize: 13, fontWeight: '800', color: '#171326' },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  tableEmpty: { padding: 16 },
  colName: { flex: 3 },
  colNumber: { flex: 1, textAlign: 'center' },
  colStatus: { flex: 1.6, alignItems: 'flex-start' },
  cellText: { fontSize: 15, fontWeight: '700' },
});
