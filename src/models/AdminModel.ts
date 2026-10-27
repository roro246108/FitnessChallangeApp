// Admin-only types; the team's participant challenge model stays unchanged.
export type AdminScreen = 'Admin Dashboard' | 'Manage Challenges' | 'Manage Users & Reports';
// The drawer can also send the admin back to the team's Home screen.
export type AdminDestination = AdminScreen | 'Home';
export type ChallengeStatus = 'Draft' | 'Active' | 'Completed';
export type UserFilter = 'All Users' | 'Reported Accounts' | 'Participation Reports';
// The signed-in admin shown as a profile picture. There is no login yet,
// so this comes from mock data. Set `imageUri` to show a real photo.
export interface AdminProfile {
  name: string;
  role: string;
  imageUri?: string;
}
export interface AdminChallenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  unit: string;
  rewardPoints: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
}
export interface ChallengeForm {
  title: string;
  description: string;
  goal: string;
  unit: string;
  rewardPoints: string;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
}
export type FormErrors = Partial<Record<keyof ChallengeForm, string>>;
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Suspended';
}
export interface AccountReport {
  id: string;
  userId: string;
  reason: string;
  details: string;
  date: string;
  reviewed: boolean;
}
export interface Participation {
  userId: string;
  challengeId: string;
  completed: boolean;
}
// One row of the dashboard's challenge overview.
export interface ChallengeSummary {
  id: string;
  title: string;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  entries: number;
  completed: number;
  completionRate: number;
}
// Values prepared by the viewmodel for each member card.
export interface UserSummary {
  user: AdminUser;
  entries: number;
  completed: number;
  completionRate: number;
  reports: AccountReport[];
}
// A report that has not been reviewed yet, with the reported user's name.
export interface PendingReport {
  id: string;
  userName: string;
  reason: string;
  date: string;
}
export const emptyChallengeForm: ChallengeForm = {
  title: '', description: '', goal: '', unit: '', rewardPoints: '',
  startDate: '', endDate: '', status: 'Draft',
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateChallenge(form: ChallengeForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Enter a title.';
  if (!form.description.trim()) errors.description = 'Enter a description.';
  if (!form.unit.trim()) errors.unit = 'Enter a goal unit, such as steps or minutes.';
  if (!form.goal.trim() || !Number.isFinite(Number(form.goal)) || Number(form.goal) <= 0)
    errors.goal = 'Goal must be a positive number.';
  if (!form.rewardPoints.trim() || !Number.isSafeInteger(Number(form.rewardPoints)) || Number(form.rewardPoints) < 0)
    errors.rewardPoints = 'Points must be a whole number of zero or more.';
  if (!isValidDate(form.startDate)) errors.startDate = 'Use a real date: YYYY-MM-DD.';
  if (!isValidDate(form.endDate)) errors.endDate = 'Use a real date: YYYY-MM-DD.';
  if (!errors.startDate && !errors.endDate && form.endDate < form.startDate)
    errors.endDate = 'End date must be on or after start date.';
  return errors;
}
// "Admin User" -> "AU" (used when there is no profile photo).
export function getInitials(name: string): string {
  const letters = name.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase());
  return letters.slice(0, 2).join('') || 'A';
}
export function completionRate(completed: number, total: number): number {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}
