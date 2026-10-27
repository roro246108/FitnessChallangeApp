import { Challenge } from '../models/challenge';

// Placeholder content: your original mockChallenge file was not in the upload
// (it contained StreakCard by mistake), so this is built from how the screen uses it.
export const mockChallenge: Challenge = {
  category: 'Steps',
  title: '10K Steps Challenge',
  durationDays: 30,
  level: 'Beginner',
  participants: 12480,
  description:
    'Walk 10,000 steps every day for 30 days. Build a habit, climb the leaderboard and earn points with your friends.',
  endsIn: { days: 12, hours: 6, minutes: 24 },
  elapsedDays: 18,
  target: '10K',
  reward: '500 pts',
  rules: [
    'Reach 10,000 steps every day',
    'Upload a workout photo as evidence',
    'Evidence must be verified within 24 hours',
    'Missing a day resets your streak',
  ],
  details: [
    { icon: 'calendar-outline', title: 'Duration', subtitle: '30 days' },
    { icon: 'speedometer-outline', title: 'Level', subtitle: 'Beginner friendly' },
    { icon: 'people-outline', title: 'Participants', subtitle: '12,480 joined' },
  ],
  rewards: [
    { icon: 'trophy-outline', title: 'Challenge badge', subtitle: 'Shown on your profile' },
    { icon: 'star-outline', title: '500 points', subtitle: 'Added when you finish' },
    { icon: 'ribbon-outline', title: 'Top 10 bonus', subtitle: '+100 extra points' },
  ],
};
