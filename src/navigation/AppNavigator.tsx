import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import PostListScreen from '../features/posts/screens/PostListScreen';

export type AppStackParamList = {
  PostList: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

// Stack navigator for authenticated users
const PostsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="PostList" component={PostListScreen} options={{ title: 'Posts' }} />
  </Stack.Navigator>
);

// Root navigator — switches between auth and app based on Firebase user state
const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Show spinner while Firebase resolves the initial auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
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
