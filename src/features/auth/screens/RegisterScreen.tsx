import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../navigation/AuthNavigator';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../../constants/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const { register, error, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = () => {
    if (passwordMismatch || !email || !password) return;
    register(email, password);
  };

  return (
    <SafeAreaView style={styles.screen}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* App icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name="book-outline" size={28} color="#fff" />
        </View>

        {/* Title and subtitle */}
        <Text style={styles.title}>The Living Archive</Text>
        <Text style={styles.subtitle}>Join our curated editorial community.</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View>
            <Input
              label="Confirm Password"
              placeholder="Re-type your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={passwordMismatch ? styles.inputError : undefined}
            />
            {passwordMismatch && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Firebase error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            label="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={passwordMismatch || !email || !password}
          />
        </View>

        {/* Navigate to Login */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
    gap: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  bottomText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
});

export default RegisterScreen;
