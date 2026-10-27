import { Platform } from 'react-native';

// the native animation driver is not available on web, so it is turned off there
export const NATIVE = Platform.OS !== 'web';