import { AuthProvider } from './src/features/auth/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // AuthProvider wraps everything — makes auth state available to the entire app
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
