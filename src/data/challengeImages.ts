
import type { ImageSourcePropType } from 'react-native';
import type { ChallengeCategory } from '../models/ActivityModel';

export const CHALLENGE_IMAGES: Record<ChallengeCategory, ImageSourcePropType> = {
  Steps: require('../assets/photos/steps.jpg'),
  Cardio: require('../assets/photos/Cardio.jpg'),
  Strength: require('../assets/photos/Strength.jpg'),
  Flexibility: require('../assets/photos/flexibility.jpg'),
};
