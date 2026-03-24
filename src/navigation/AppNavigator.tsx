import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/theme';
import { useAuth } from '../features/auth/hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import PostListScreen from '../features/posts/screens/PostListScreen';
import PostDetailScreen from '../features/posts/screens/PostDetailScreen';

export type AppStackParamList = {
  PostList: undefined;
  PostDetail: { postId: number };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const PostsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PostList" component={PostListScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.indigo} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <PostsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
