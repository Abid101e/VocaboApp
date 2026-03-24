import { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { hasError: true, message };
  }

  retry = () => {
    this.setState({ hasError: false, message: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={56} color={colors.postTextSecondary} />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.message}</Text>
          <TouchableOpacity style={styles.button} onPress={this.retry} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.postBackground,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.postText,
  },
  message: {
    fontSize: 14,
    color: colors.postTextSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.indigo,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
