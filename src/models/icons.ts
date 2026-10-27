import { Ionicons } from '@expo/vector-icons';

// Valid Ionicons names, so a typo in an icon name is a compile error.
export type IoniconName = keyof typeof Ionicons.glyphMap;
