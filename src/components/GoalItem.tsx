
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { Colors } from '../theme/Color';
import type { Goal } from '../viewmodels/useMyGoalsViewModel';
import { CATEGORY_IMAGE, INK } from '../data/goalMeta';

interface Props {
  goal: Goal;
  colors: Colors;
  onAdd: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GoalItem({
  goal,
  colors,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const done = goal.current >= goal.target;
  const pct =
    goal.target > 0
      ? Math.min(Math.max(goal.current / goal.target, 0), 1)
      : 0;

  const percentage = Math.round(pct * 100);
  const remaining = Math.max(goal.target - goal.current, 0);
  const isWater = goal.category === 'Water';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.track,
        },
      ]}
    >
      <View style={styles.top}>
        <Image
          source={{ uri: CATEGORY_IMAGE[goal.category] }}
          style={styles.goalImage}
          resizeMode="cover"
          accessibilityLabel={`${goal.category} photo`}
        />

        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {goal.title}
          </Text>

          <Text style={[styles.sub, { color: colors.muted }]}>
            {goal.current.toLocaleString('en-US')} /{' '}
            {goal.target.toLocaleString('en-US')} {goal.unit}
          </Text>
        </View>

        <View style={styles.rightActions}>
          <Text
            style={[
              styles.percentage,
              { color: done ? colors.lime : colors.primary },
            ]}
          >
            {percentage}%
          </Text>

          <View style={styles.iconActions}>
            <TouchableOpacity
              onPress={onEdit}
              style={styles.iconBtn}
              accessibilityLabel="Edit goal"
              hitSlop={6}
            >
              <Feather
                name="edit-2"
                size={17}
                color={colors.muted}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              style={styles.iconBtn}
              accessibilityLabel="Delete goal"
              hitSlop={6}
            >
              <Feather
                name="trash-2"
                size={17}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.track,
          { backgroundColor: colors.track },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: done
                ? colors.lime
                : colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.remaining}>
          <Feather
            name={done ? 'check-circle' : 'target'}
            size={15}
            color={done ? colors.lime : colors.lavender}
          />
          <Text
            style={[
              styles.remainingText,
              { color: done ? colors.lime : colors.muted },
            ]}
            numberOfLines={2}
          >
            {done
              ? 'Goal completed!'
              : `${remaining.toLocaleString('en-US')} ${goal.unit} left`}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onAdd}
          disabled={done}
          activeOpacity={0.8}
          accessibilityLabel={
            isWater ? 'Add water progress' : 'Log goal progress'
          }
          style={[
            styles.actionBtn,
            {
              backgroundColor: done
                ? colors.track
                : isWater
                  ? 'transparent'
                  : colors.primary,
              borderColor: done
                ? colors.track
                : colors.primary,
              borderWidth: isWater && !done ? 1 : 0,
              opacity: done ? 0.65 : 1,
            },
          ]}
        >
          <Feather
            name={done ? 'check' : 'plus'}
            size={15}
            color={
              done
                ? colors.muted
                : isWater
                  ? colors.primary
                  : '#FFFFFF'
            }
          />
          <Text
            style={[
              styles.actionText,
              {
                color: done
                  ? colors.muted
                  : isWater
                    ? colors.primary
                    : '#FFFFFF',
              },
            ]}
          >
            {done
              ? 'Completed'
              : isWater
                ? 'Add glass'
                : 'Log progress'}
          </Text>
        </TouchableOpacity>
      </View>

      {!done && (
        <TouchableOpacity
          onPress={onToggle}
          style={styles.markDone}
          activeOpacity={0.8}
        >
          <Feather
            name="check-circle"
            size={14}
            color={colors.muted}
          />
          <Text
            style={[
              styles.markDoneText,
              { color: colors.muted },
            ]}
          >
            Mark done
          </Text>
        </TouchableOpacity>
      )}

      {done && (
        <View style={styles.completedMessage}>
          <Feather
            name="check-circle"
            size={14}
            color={INK}
          />
          <Text style={styles.completedText}>
            Completed · Great job!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  goalImage: {
    width: 92,
    height: 92,
    borderRadius: 14,
    backgroundColor: '#241C40',
  },
  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  sub: {
    fontSize: 11,
    marginTop: 5,
  },
  rightActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '800',
  },
  iconActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 5,
  },
  track: {
    height: 8,
    borderRadius: 5,
    marginTop: 11,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  remaining: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  remainingText: {
    fontSize: 11,
    flexShrink: 1,
  },
  actionBtn: {
    minWidth: 112,
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  markDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 9,
    paddingVertical: 3,
  },
  markDoneText: {
    fontSize: 11,
    fontWeight: '600',
  },
  completedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 9,
  },
  completedText: {
    color: '#CDFF7E',
    fontSize: 11,
    fontWeight: '700',
  },
});
