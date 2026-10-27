
import type { ImageSourcePropType } from 'react-native';

export const CHALLENGE_IMAGES: Record<
  string,
  ImageSourcePropType | undefined
> = {
  Steps: {
    uri: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=90',
  },

  Cardio: {
    uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=90',
  },

  Strength: {
    uri: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=90',
  },

  Flexibility: {
    uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=90',
  },
};
