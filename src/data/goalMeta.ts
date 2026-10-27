
import type { GoalCategory } from '../viewmodels/useMyGoalsViewModel';

export const INK = '#171326';

export const CATEGORY_IMAGE: Record<GoalCategory, string> = {
  Steps:
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&h=600&q=90',

  Water:
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&h=600&q=90',

  Cardio:
    'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=600&h=600&q=90',

  Strength:
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&h=600&q=90',

  Flexibility:
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&h=600&q=90',
};

export const CATEGORY_ICON: Record<GoalCategory, string> = {
  Steps: '👟',
  Cardio: '❤️',
  Strength: '💪',
  Flexibility: '🧘',
  Water: '💧',
};
