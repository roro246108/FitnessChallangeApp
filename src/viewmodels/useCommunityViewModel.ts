import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_POSTS, type Comment, type CommunityPost, type Reaction } from '../data/mockCommunity';
import type { EvidenceRecord } from './useEvidenceHistory';

const EVIDENCE_KEY = 'fitness.evidence.v1';
const INTERACTIONS_KEY = 'fitness.community.v1';

type Interactions = Record<string, { myReaction: Reaction | null; comments: Comment[] }>;

export interface PostView extends CommunityPost {
  myReaction: Reaction | null;
}

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function useCommunityViewModel(challengeTitle: string) {
  const [own, setOwn] = useState<CommunityPost[]>([]);
  const [interactions, setInteractions] = useState<Interactions>({});
  const [loaded, setLoaded] = useState(false);

  // load your shared proofs for this challenge + saved reactions/comments
  useEffect(() => {
    (async () => {
      try {
        const rawEvidence = await AsyncStorage.getItem(EVIDENCE_KEY);
        const records: EvidenceRecord[] = rawEvidence ? JSON.parse(rawEvidence) : [];
        const mine: CommunityPost[] = records
          .filter((r) => r.challenge === challengeTitle && r.visibility === 'community')
          .map((r) => ({
            id: r.id,
            author: 'You',
            avatar: '⭐',
            emoji: '📸',
            bg: '#4B2FD6',
            uri: r.uri,
            note: r.note || 'Workout proof',
            time: new Date(r.submittedAt).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            reactions: { '🔥': 0, '💪': 0, '👏': 0 },
            comments: [],
            mine: true,
          }));
        setOwn(mine);

        const rawInteractions = await AsyncStorage.getItem(INTERACTIONS_KEY);
        if (rawInteractions) setInteractions(JSON.parse(rawInteractions) as Interactions);
      } catch {
        // storage is optional
      } finally {
        setLoaded(true);
      }
    })();
  }, [challengeTitle]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions)).catch(() => {});
  }, [interactions, loaded]);

  const posts: PostView[] = useMemo(
    () =>
      [...own, ...MOCK_POSTS].map((p) => {
        const i = interactions[p.id];
        return {
          ...p,
          myReaction: i?.myReaction ?? null,
          comments: [...p.comments, ...(i?.comments ?? [])],
        };
      }),
    [own, interactions],
  );

  const react = useCallback((postId: string, r: Reaction) => {
    setInteractions((cur) => {
      const prev = cur[postId] ?? { myReaction: null, comments: [] };
      return { ...cur, [postId]: { ...prev, myReaction: prev.myReaction === r ? null : r } };
    });
  }, []);

  const addComment = useCallback((postId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const comment: Comment = { id: `c${Date.now()}`, author: 'You', text: clean, time: clock() };
    setInteractions((cur) => {
      const prev = cur[postId] ?? { myReaction: null, comments: [] };
      return { ...cur, [postId]: { ...prev, comments: [...prev.comments, comment] } };
    });
  }, []);

  return { posts, react, addComment };
}