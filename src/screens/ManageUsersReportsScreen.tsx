import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AdminButton, AdminCard, AdminInput, AdminLayout, AdminModal, AdminText, ConfirmModal, EmptyState, ProgressBar, StatusBadge } from '../components/admin/AdminComponents';
import type { AdminScreenProps } from '../components/admin/AdminComponents';
import type { AccountReport, AdminUser, UserFilter } from '../models/AdminModel';

const filters: UserFilter[] = ['All Users', 'Reported Accounts', 'Participation Reports'];
export default function ManageUsersReportsScreen(props: AdminScreenProps) {
  const { colors, vm } = props;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<UserFilter>(vm.requestedFilter ?? 'All Users');
  const [selectedReport, setSelectedReport] = useState<AccountReport | null>(null);
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  // Start on the filter the dashboard asked for (e.g. "Review reports"), then clear the request.
  const { requestedFilter, clearRequestedFilter } = vm;
  useEffect(() => {
    if (requestedFilter) clearRequestedFilter();
  }, [requestedFilter, clearRequestedFilter]);
  const visibleUsers = vm.getVisibleUsers(query, filter);
  const nextStatus = pendingUser?.status === 'Active' ? 'Suspended' : 'Active';
  return <AdminLayout {...props} screen="Manage Users & Reports" subtitle="Support your members. Celebrate their progress.">
    <AdminInput colors={colors} label="Search users" placeholder="Search name or email" autoCapitalize="none" autoCorrect={false} value={query} onChangeText={setQuery} />
    <View style={styles.filters}>{filters.map(item => <AdminButton key={item} colors={colors} title={`${filter === item ? '✓ ' : ''}${item}`} variant={filter === item ? 'primary' : 'secondary'} onPress={() => setFilter(item)} />)}</View>
    <AdminText colors={colors}>{visibleUsers.length} matching users · {filter}</AdminText>
    {filter === 'Reported Accounts' && <AdminText colors={colors}>Reviewed reports stay here as sample history. Reviewing does not automatically suspend an account.</AdminText>}
    {!visibleUsers.length && <EmptyState colors={colors} message="No users match this search or filter. Try another name or clear your search." />}
    {visibleUsers.map(summary => {
      const { user, entries, completed, completionRate: rate, reports } = summary;
      return <AdminCard key={user.id} colors={colors}>
        <StatusBadge colors={colors} label={user.status} />
        <AdminText colors={colors} heading>{user.name}</AdminText>
        <AdminText colors={colors}>{user.email}</AdminText>
        {filter === 'Participation Reports' ? <>
          <AdminText colors={colors}>{entries} challenges joined · {completed} completed</AdminText>
          <ProgressBar colors={colors} value={rate} />
          <AdminText colors={colors}>{rate}% completion{entries === 0 ? ' · No participation yet' : ''}</AdminText>
        </> : <>
          {filter === 'Reported Accounts' && reports.map(report => <View key={report.id} style={[styles.report, { borderColor: colors.track }]}>
            <AdminText colors={colors}>{report.reason}</AdminText>
            <StatusBadge colors={colors} label={report.reviewed ? 'Reviewed' : 'Needs review'} />
            <AdminButton colors={colors} title="Review report details" variant="secondary" onPress={() => setSelectedReport(report)} />
          </View>)}
          <AdminButton colors={colors} title={user.status === 'Active' ? 'Suspend account' : 'Activate account'} variant="secondary" onPress={() => setPendingUser(user)} />
        </>}
      </AdminCard>;
    })}
    {filter === 'Participation Reports' && <>
      <AdminText colors={colors} heading>Challenge breakdown</AdminText>
      <AdminText colors={colors}>All sample challenges; user search applies to the member cards above.</AdminText>
      {!vm.challenges.length && <EmptyState colors={colors} message="Create a challenge to see its participation summary here." />}
      {vm.challengeSummaries.map(challenge => {
        const { entries, completed, completionRate: rate } = challenge;
        return <AdminCard colors={colors} key={challenge.id}>
          <AdminText colors={colors} heading>{challenge.title}</AdminText>
          <AdminText colors={colors}>{entries} participants · {completed} completed · {rate}%</AdminText>
          <ProgressBar colors={colors} value={rate} />
        </AdminCard>;
      })}
    </>}
    {selectedReport && <AdminModal colors={colors} title="Report details" onClose={() => setSelectedReport(null)}>
      <AdminCard colors={colors}>
        <AdminText colors={colors} heading>{vm.getReportedUserName(selectedReport.userId)}</AdminText>
        <StatusBadge colors={colors} label={selectedReport.reviewed ? 'Reviewed' : 'Needs review'} />
        <AdminText colors={colors}>{selectedReport.reason}</AdminText>
        <AdminText colors={colors}>Reported: {selectedReport.date} · {selectedReport.id}</AdminText>
        <AdminText colors={colors}>{selectedReport.details}</AdminText>
      </AdminCard>
      {!selectedReport.reviewed && <AdminButton colors={colors} title="Mark as reviewed" onPress={() => { vm.reviewReport(selectedReport.id); setSelectedReport(null); }} />}
    </AdminModal>}
    {pendingUser && <ConfirmModal colors={colors} title={nextStatus === 'Suspended' ? 'Suspend account?' : 'Activate account?'} message={`Set ${pendingUser.name} (${pendingUser.email}) to ${nextStatus.toLowerCase()}? This changes only the sample account status.`} action={nextStatus === 'Suspended' ? 'Confirm suspension' : 'Confirm activation'} onClose={() => setPendingUser(null)} onConfirm={() => { vm.changeUserStatus(pendingUser.id, nextStatus); setPendingUser(null); }} />}
  </AdminLayout>;
}
const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  report: { borderTopWidth: 1, paddingTop: 12, gap: 10 },
});
