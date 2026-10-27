import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EvidenceStatus } from '../models/evidence';

const STORAGE_KEY = 'fitness.evidence.v1';

export type EvidenceVisibility = 'community' | 'private';

export interface EvidenceRecord {
  id: string;
  challengeId?: string;
  challenge: string;
  uri: string;
  note: string;
  submittedAt: string; // ISO date
  status: EvidenceStatus;
  visibility?: EvidenceVisibility; // missing on older records = private
}

export default function useEvidenceHistory() {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setRecords(JSON.parse(raw) as EvidenceRecord[]);
      } catch {
        // storage is optional
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records)).catch(() => {});
  }, [records, loaded]);

  const add = useCallback((input: Omit<EvidenceRecord, 'id' | 'submittedAt'>) => {
    const record: EvidenceRecord = {
      ...input,
      id: `e${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setRecords((list) => [record, ...list]);
  }, []);

  const remove = useCallback((id: string) => {
    setRecords((list) => list.filter((r) => r.id !== id));
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setRecords((list) =>
      list.map((r) =>
        r.id === id
          ? { ...r, visibility: r.visibility === 'community' ? 'private' : 'community' }
          : r,
      ),
    );
  }, []);

  return { records, add, remove, toggleVisibility };
}