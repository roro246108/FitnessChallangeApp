import { useRef, useState } from 'react';
import { completionRate, validateChallenge } from '../models/AdminModel';
import type {
  AdminChallenge,
  AdminUser,
  ChallengeForm,
  ChallengeSummary,
  FormErrors,
  PendingReport,
  UserFilter,
  UserSummary,
} from '../models/AdminModel';
import { sampleAdmin, sampleChallenges, sampleParticipation, sampleReports, sampleUsers } from '../models/AdminMockData';

export default function useAdminViewModel() {
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [users, setUsers] = useState(sampleUsers);
  const [reports, setReports] = useState(sampleReports);
  const [participation, setParticipation] = useState(sampleParticipation);
  const [feedback, setFeedback] = useState('');
  // Lets the dashboard open Users & Reports with a filter already selected.
  const [requestedFilter, setRequestedFilter] = useState<UserFilter | null>(null);
  const nextId = useRef(1);

  function saveChallenge(form: ChallengeForm, id?: string): FormErrors {
    const errors = validateChallenge(form);
    if (Object.keys(errors).length) return errors;
    const challenge: AdminChallenge = {
      ...form, id: id ?? `new-${nextId.current++}`,
      title: form.title.trim(), description: form.description.trim(), unit: form.unit.trim(),
      goal: Number(form.goal), rewardPoints: Number(form.rewardPoints),
    };
    setChallenges(current => id ? current.map(item => item.id === id ? challenge : item) : [...current, challenge]);
    setFeedback(id ? 'Challenge updated.' : 'Challenge created.');
    return {};
  }
  function deleteChallenge(id: string) {
    setChallenges(current => current.filter(item => item.id !== id));
    // Remove related sample entries so all reports remain consistent.
    setParticipation(current => current.filter(item => item.challengeId !== id));
    setFeedback('Challenge and its sample participation entries deleted.');
  }
  function changeUserStatus(id: string, status: AdminUser['status']) {
    setUsers(current => current.map(user => user.id === id ? { ...user, status } : user));
    setFeedback(`Account ${status.toLowerCase()}.`);
  }
  function reviewReport(id: string) {
    setReports(current => current.map(report => report.id === id ? { ...report, reviewed: true } : report));
    setFeedback('Report marked as reviewed. Account status is unchanged.');
  }
  // Everything below is recalculated from the current data on every render,
  // so the dashboard stays correct after any create, edit, delete or review.
  const completed = participation.filter(item => item.completed).length;
  const pendingReports: PendingReport[] = reports
    .filter(report => !report.reviewed)
    .map(report => ({
      id: report.id,
      userName: users.find(user => user.id === report.userId)?.name ?? 'Sample user',
      reason: report.reason,
      date: report.date,
    }));
  const challengeSummaries: ChallengeSummary[] = challenges.map(challenge => {
    const entries = participation.filter(item => item.challengeId === challenge.id);
    const completedEntries = entries.filter(item => item.completed).length;
    return {
      id: challenge.id,
      title: challenge.title,
      status: challenge.status,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      entries: entries.length,
      completed: completedEntries,
      completionRate: completionRate(completedEntries, entries.length),
    };
  });
  // Numbers for the small bar charts on wide screens.
  const entriesPerUser = users.map(
    user => participation.filter(item => item.userId === user.id).length,
  );
  const completionByChallenge = challengeSummaries.map(item =>
    item.completionRate,
  );
  const participants = new Set(participation.map(item => item.userId)).size;
  const stats = {
    totalUsers: users.length,
    suspendedUsers: users.filter(user => user.status === 'Suspended').length,
    activeUsers: users.filter(user => user.status === 'Active').length,
    totalChallenges: challenges.length,
    activeChallenges: challenges.filter(item => item.status === 'Active').length,
    completedChallenges: challenges.filter(item => item.status === 'Completed').length,
    entries: participation.length,
    participants,
    participationRate: completionRate(participants, users.length),
    completed,
    inProgress: participation.length - completed,
    inProgressRate: completionRate(participation.length - completed, participation.length),
    completionRate: completionRate(completed, participation.length),
    pendingReports: pendingReports.length,
    reviewedReports: reports.length - pendingReports.length,
  };
  // Views pass their input values; filtering and report calculations live here.
  function getVisibleUsers(query: string, filter: UserFilter): UserSummary[] {
    const search = query.trim().toLowerCase();
    return users
      .filter(user =>
        (user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)) &&
        (filter !== 'Reported Accounts' || reports.some(report => report.userId === user.id))
      )
      .map(user => {
        const entries = participation.filter(entry => entry.userId === user.id);
        const completed = entries.filter(entry => entry.completed).length;
        return {
          user,
          entries: entries.length,
          completed,
          completionRate: completionRate(completed, entries.length),
          reports: reports.filter(report => report.userId === user.id),
        };
      });
  }
  function getReportedUserName(userId: string): string {
    return users.find(user => user.id === userId)?.name ?? 'Sample user';
  }
  // The dashboard calls this, then navigates to Users & Reports.
  function showReportedAccounts() {
    setRequestedFilter('Reported Accounts');
  }
  return {
    admin: sampleAdmin,
    challenges, users, reports, participation, feedback, stats,
    pendingReports, challengeSummaries, entriesPerUser, completionByChallenge, requestedFilter,
    clearFeedback: () => setFeedback(''),
    clearRequestedFilter: () => setRequestedFilter(null),
    showReportedAccounts, getVisibleUsers, getReportedUserName,
    saveChallenge, deleteChallenge, changeUserStatus, reviewReport,
  };
}
export type AdminViewModel = ReturnType<typeof useAdminViewModel>;
