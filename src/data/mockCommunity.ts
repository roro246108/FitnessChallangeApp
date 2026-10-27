
export type Reaction = '🔥' | '💪' | '👏';
export const REACTIONS: Reaction[] = ['🔥', '💪', '👏'];

export interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  avatarUri?: string;
  emoji: string;
  bg: string;
  uri?: string;
  note: string;
  time: string;
  reactions: Record<Reaction, number>;
  comments: Comment[];
  mine?: boolean;
}

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'm1',
    author: 'Omar',
    avatar: '🧔',
    avatarUri:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=85',
    emoji: '🏃',
    bg: '#7C5CFF',
    uri:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=900&q=85',
    note: 'Day 5 done before work!',
    time: 'Today, 8:10 AM',
    reactions: { '🔥': 6, '💪': 3, '👏': 2 },
    comments: [
      { id: 'c1', author: 'Sara', text: 'Beast mode 🔥', time: '8:20 AM' },
      { id: 'c2', author: 'Youssef', text: 'Keep it up!', time: '8:41 AM' },
    ],
  },
  {
    id: 'm2',
    author: 'Sara',
    avatar: '👩‍🦰',
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=85',
    emoji: '🧘',
    bg: '#F472B6',
    uri:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85',
    note: 'Stretching after my session',
    time: 'Today, 9:30 AM',
    reactions: { '🔥': 2, '💪': 1, '👏': 5 },
    comments: [
      { id: 'c3', author: 'Mona', text: 'So proud of you 👏', time: '9:45 AM' },
    ],
  },
  {
    id: 'm3',
    author: 'Youssef',
    avatar: '🧑',
    avatarUri:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=85',
    emoji: '🏋️',
    bg: '#22A06B',
    uri:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    note: 'New personal best 💥',
    time: 'Today, 11:05 AM',
    reactions: { '🔥': 9, '💪': 7, '👏': 3 },
    comments: [],
  },
  {
    id: 'm4',
    author: 'Nour',
    avatar: '👧',
    avatarUri:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=85',
    emoji: '🚶',
    bg: '#F5A524',
    uri:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85',
    note: '12k steps ✅',
    time: 'Yesterday',
    reactions: { '🔥': 3, '💪': 2, '👏': 1 },
    comments: [],
  },
];
