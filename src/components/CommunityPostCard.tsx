
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { REACTIONS, type Reaction } from '../data/mockCommunity';
import type { PostView } from '../viewmodels/useCommunityViewModel';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=85';

interface Props {
  post: PostView;
  onReact: (r: Reaction) => void;
  onOpenComments: () => void;
}

export default function CommunityPostCard({
  post,
  onReact,
  onOpenComments,
}: Props) {
  const { colors } = useTheme();

  const [imgFailed, setImgFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const entrance = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [entrance]);

  const showPhoto = !!post.uri && !imgFailed;
  const avatarUri = post.avatarUri || DEFAULT_AVATAR;

  const animatePress = (value: number) => {
    Animated.spring(pressScale, {
      toValue: value,
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.track,
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [22, 0],
              }),
            },
            { scale: pressScale },
          ],
        },
      ]}
    >
      <View style={styles.head}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.lavender,
              borderColor: colors.primary,
            },
          ]}
        >
          {!avatarFailed ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <Text style={styles.avatarFallback}>{post.avatar}</Text>
          )}

          <View
            style={[
              styles.onlineDot,
              { borderColor: colors.card },
            ]}
          />
        </View>

        <View style={styles.authorInfo}>
          <Text style={[styles.name, { color: colors.text }]}>
            {post.author}
          </Text>
          <Text style={[styles.time, { color: colors.muted }]}>
            {post.time}
          </Text>
        </View>

        {post.mine && (
          <View style={[styles.badge, { backgroundColor: colors.lime }]}>
            <Text style={styles.badgeText}>Your proof</Text>
          </View>
        )}
      </View>

      {showPhoto ? (
        <TouchableOpacity
          activeOpacity={0.94}
          onPressIn={() => animatePress(0.985)}
          onPressOut={() => animatePress(1)}
        >
          <Image
            source={{ uri: post.uri }}
            style={styles.photo}
            resizeMode="cover"
            onError={() => setImgFailed(true)}
          />
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.photo,
            styles.placeholder,
            { backgroundColor: post.bg },
          ]}
        >
          <Text style={styles.placeholderEmoji}>{post.emoji}</Text>
        </View>
      )}

      <Text style={[styles.note, { color: colors.text }]}>
        {post.note}
      </Text>

      <View style={styles.actions}>
        {REACTIONS.map((r) => {
          const active = post.myReaction === r;
          const count = post.reactions[r] + (active ? 1 : 0);

          return (
            <TouchableOpacity
              key={r}
              activeOpacity={0.75}
              onPress={() => onReact(r)}
              style={[
                styles.react,
                {
                  backgroundColor: active
                    ? colors.primary
                    : colors.track,
                },
              ]}
            >
              <Text style={styles.reactionEmoji}>{r}</Text>
              <Text
                style={{
                  color: active ? '#FFFFFF' : colors.text,
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenComments}
          style={styles.commentBtn}
        >
          <Feather
            name="message-circle"
            size={18}
            color={colors.primary}
          />
          <Text
            style={{
              color: colors.primary,
              fontWeight: '800',
              fontSize: 12,
            }}
          >
            {post.comments.length}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarFallback: {
    fontSize: 20,
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#20D889',
    borderWidth: 2,
  },
  authorInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
  },
  time: {
    fontSize: 11,
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#171326',
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 17,
    backgroundColor: '#29243F',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 72,
  },
  note: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  react: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 14,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  commentBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
});
