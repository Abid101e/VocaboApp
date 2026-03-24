import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.badge}>
        <Text style={styles.badgeText}>#{post.id}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {toSentenceCase(post.title)}
      </Text>

      <Text style={styles.body} numberOfLines={2}>
        {post.body.replace(/\n/g, ' ')}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.user}>User {post.userId}</Text>
        <View style={styles.likeRow}>
          <Ionicons name="heart-outline" size={14} color={colors.postTextSecondary} />
          <Text style={styles.likeCount}>0</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.postCard,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.indigo,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
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
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.postBorder,
  },
  user: {
    fontSize: 12,
    color: colors.postTextSecondary,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: colors.postTextSecondary,
  },
});

export default PostCard;
