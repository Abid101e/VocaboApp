import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../../../types';
import { useAuth } from '../../auth/hooks/useAuth';
import usePosts from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import { colors, spacing } from '../../../constants/theme';

const PostListScreen = () => {
  const { logout } = useAuth();
  const { posts, loading, initialLoading, error, loadMore } = usePosts();

  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostCard post={item} onPress={() => {}} />
  ), []);

  if (initialLoading) return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.indigo} />
      </View>
    </SafeAreaView>
  );

  if (error && posts.length === 0) return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.centeredContainer}>
        <Text style={styles.messageText}>{error}</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Posts</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={colors.postText} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={styles.footer} color={colors.indigo} /> : null
        }
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.messageText}>No posts available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.postBackground,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.postText,
  },
  list: {
    padding: spacing.md,
    gap: 12,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    color: colors.postTextSecondary,
  },
  footer: {
    paddingVertical: spacing.md,
  },
});

export default PostListScreen;
