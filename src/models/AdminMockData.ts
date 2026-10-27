import type { AccountReport, AdminChallenge, AdminProfile, AdminUser, Participation } from './AdminModel';

export const sampleChallenges: AdminChallenge[] = [
  { id: 'steps', title: 'Step into your best', description: 'Build a daily walking habit with the community.', goal: 10000, unit: 'steps per day', rewardPoints: 150, startDate: '2026-10-01', endDate: '2026-10-31', status: 'Active' },
  { id: 'stretch', title: 'Stretch & reset', description: 'Make room for a little mindful movement.', goal: 15, unit: 'minutes per day', rewardPoints: 80, startDate: '2026-10-01', endDate: '2026-10-31', status: 'Active' },
  { id: 'run', title: 'Your first 5K', description: 'Celebrate a personal running milestone.', goal: 5, unit: 'kilometres', rewardPoints: 200, startDate: '2026-09-01', endDate: '2026-09-30', status: 'Completed' },
];
export const sampleUsers: AdminUser[] = [
  { id: 'u1', name: 'Maya Hassan', email: 'maya@example.com', status: 'Active' },
  { id: 'u2', name: 'Omar Ali', email: 'omar@example.com', status: 'Active' },
  { id: 'u3', name: 'Nour Ahmed', email: 'nour@example.com', status: 'Suspended' },
  { id: 'u4', name: 'Salma Mostafa', email: 'salma@example.com', status: 'Active' },
];
export const sampleReports: AccountReport[] = [
  { id: 'r1', userId: 'u2', reason: 'Unusual activity totals', details: 'A sample report flags a sudden jump in daily step totals. Review the account before deciding on an action. This is fictional demo data.', date: '2026-10-24', reviewed: false },
  { id: 'r2', userId: 'u3', reason: 'Inappropriate community comment', details: 'A sample participant reported an unkind comment in a challenge discussion. The sample account is currently suspended.', date: '2026-10-23', reviewed: false },
];
export const sampleParticipation: Participation[] = [
  { userId: 'u1', challengeId: 'steps', completed: true },
  { userId: 'u2', challengeId: 'steps', completed: false },
  { userId: 'u4', challengeId: 'steps', completed: true },
  { userId: 'u1', challengeId: 'stretch', completed: true },
  { userId: 'u3', challengeId: 'stretch', completed: false },
  { userId: 'u4', challengeId: 'run', completed: true },
];
// Sample signed-in admin. Add imageUri: 'https://...' to show a photo instead of initials.
export const sampleAdmin: AdminProfile = {
  name: 'Admin User',
  role: 'Administrator',
};
