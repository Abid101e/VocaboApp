import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../auth/hooks/useAuth';
import { colors, spacing } from '../../../constants/theme';

const PostListScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi</Text>

      {/* Logout button */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
  logoutText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: '500',
  },
});

export default PostListScreen;
