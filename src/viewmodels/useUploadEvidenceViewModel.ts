import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { EvidenceStatus } from '../models/evidence';

export const MAX_PHOTOS = 3;
export const MAX_MB = 5;

export const haptic = (type: 'light' | 'success' = 'light') => {
  try {
    if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // haptics are optional
  }
};

export function useUploadEvidenceViewModel(initialStatus: EvidenceStatus | null = null) {
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<EvidenceStatus | null>(initialStatus);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [submitCount, setSubmitCount] = useState(0);

  const progressRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // stop the fake upload if the screen closes
  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (doneRef.current) clearTimeout(doneRef.current);
    },
    []
  );

  const stepIndex = status ? 2 : images.length > 0 ? 1 : 0;

  /* ---------------------------- photos ---------------------------- */
  const addAsset = (asset: ImagePicker.ImagePickerAsset) => {
    if (asset.fileSize && asset.fileSize > MAX_MB * 1024 * 1024) {
      Alert.alert('Photo is too large', `Choose a photo under ${MAX_MB}MB.`);
      return;
    }
    setError('');
    const next = [...images, asset.uri].slice(0, MAX_PHOTOS);
    setImages(next);
    setSelected(next.length - 1);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera access needed', 'Allow camera access to take a workout photo.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) addAsset(res.assets[0]);
  };

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Gallery access needed', 'Allow photo access to choose a workout photo.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!res.canceled) addAsset(res.assets[0]);
  };

  const removeImage = (index: number) => {
    haptic();
    setImages((prev) => prev.filter((_, i) => i !== index));
    setSelected(0);
  };

  const selectImage = (index: number) => {
    haptic();
    setSelected(index);
  };

  /* ---------------------------- upload ---------------------------- */
  const upload = useCallback(() => {
    if (images.length === 0) {
      setError('Add at least one photo before uploading.');
      return;
    }
    haptic();
    setError('');
    setUploading(true);
    progressRef.current = 0;
    setProgress(0);

    // UI simulation: replace with your real cloud storage upload.
    timerRef.current = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + 7 + Math.random() * 6, 100);
      setProgress(progressRef.current);

      if (progressRef.current >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        doneRef.current = setTimeout(() => {
          setSubmitCount((n) => n + 1);
          setUploading(false);
          setSubmittedAt(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );
          setStatus('pending');
          haptic('success');
        }, 300);
      }
    }, 140);
  }, [images.length]);

  const retry = () => {
    haptic();
    setStatus(null);
    setImages([]);
    setSelected(0);
    setProgress(0);
    setNote('');
  };

  return {
    images,
    selected,
    note,
    setNote,
    uploading,
    progress,
    error,
    status,
    setStatus,
    submittedAt,
    submitCount,
    stepIndex,
    takePhoto,
    pickPhoto,
    removeImage,
    selectImage,
    upload,
    retry,
  };
}
