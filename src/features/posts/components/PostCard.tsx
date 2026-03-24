import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Post } from '../../../types';
import { colors, spacing, radius } from '../../../constants/theme';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

const toSentenceCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const PostCard = ({ post, onPress }: PostCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {toSentenceCase(post.title)}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {post.body.replace(/\n/g, ' ')}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.user}>User {post.userId}</Text>
          <Text style={styles.postNumber}>#{post.id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.postCard,
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accent: {
    width: 4,
    backgroundColor: colors.indigo,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.postText,
    lineHeight: 21,
  },
  body: {
    fontSize: 13,
    color: colors.postTextSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  user: {
    fontSize: 12,
    color: colors.postTextSecondary,
  },
  postNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.indigo,
  },
});

export default memo(PostCard);
