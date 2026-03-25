import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../auth/hooks/useAuth';
import usePostDetail from '../hooks/usePostDetail';
import type { AppStackParamList } from '../../../navigation/AppNavigator';
import { Comment } from '../../../types';
import { colors, spacing, radius } from '../../../constants/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'PostDetail'>;

const PostDetailScreen = ({ route, navigation }: Props) => {
  const { postId } = route.params;
  const { user } = useAuth();
  const {
    post,
    loading,
    error,
    likeCount,
    isLiked,
    comments,
    commentText,
    setCommentText,
    toggleLike,
    submitComment,
  } = usePostDetail(
    postId,
    user!.uid,
    user!.displayName || user!.email?.split('@')[0] || 'User',
  );

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <View style={styles.commentItem}>
        <Text style={styles.commentAuthor}>
          {item.userId === user!.uid ? 'You' : item.userName}
        </Text>
        <Text style={styles.commentBody}>{item.text}</Text>
      </View>
    ),
    [user],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.indigo} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <Text style={styles.messageText}>{error ?? 'Post not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Back button + screen title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.postText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Post body + comments list */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              {/* Full post content + like button */}
              <View style={styles.postSection}>
                <View style={styles.authorRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.userId}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>User {post.userId}</Text>
                    <Text style={styles.postMeta}>Post #{post.id}</Text>
                  </View>
                </View>

                <Text style={styles.title}>
                  {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
                </Text>
                <Text style={styles.body}>{post.body}</Text>

                <TouchableOpacity
                  style={styles.likeRow}
                  onPress={toggleLike}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isLiked ? '#EF4444' : colors.postTextSecondary}
                  />
                  <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Comments section heading */}
              <Text style={styles.commentsHeading}>
                Comments ({comments.length})
              </Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.noComments}>No comments yet. Be the first!</Text>
          }
        />

        {/* Comment input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Write a comment..."
            placeholderTextColor={colors.postTextSecondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
            onPress={submitComment}
            disabled={!commentText.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.postBackground,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    color: colors.postTextSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.postCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.postBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.postText,
  },
  headerSpacer: {
    width: 24,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  postSection: {
    backgroundColor: colors.postCard,
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.postBorder,
    marginBottom: spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.indigo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  authorInfo: {
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.postText,
  },
  postMeta: {
    fontSize: 12,
    color: colors.postTextSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.postText,
    lineHeight: 26,
  },
  body: {
    fontSize: 14,
    color: colors.postTextSecondary,
    lineHeight: 22,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.postBorder,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.postTextSecondary,
  },
  likeCountActive: {
    color: '#EF4444',
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.postText,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  noComments: {
    fontSize: 14,
    color: colors.postTextSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  commentItem: {
    backgroundColor: colors.postCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.postBorder,
    gap: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.postText,
  },
  commentBody: {
    fontSize: 14,
    color: colors.postTextSecondary,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.postCard,
    borderTopWidth: 1,
    borderTopColor: colors.postBorder,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.postBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.postText,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.postBorder,
  },
  sendButton: {
    backgroundColor: colors.indigo,
    borderRadius: radius.pill,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.postBorder,
  },
});

export default PostDetailScreen;
