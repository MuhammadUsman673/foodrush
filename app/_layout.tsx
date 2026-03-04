import { Stack } from 'expo-router';
import { CartProvider } from '../store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

export default function RootLayout() {
  useEffect(() => {
    // Handle deep links
    const handleDeepLink = async (url: string) => {
      if (url.includes('reset-password')) {
        const params = Linking.parse(url);
        const token = params.queryParams?.token_hash as string;
        const type = params.queryParams?.type as string;

        if (token && type === 'recovery') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          });
          if (!error) {
            router.push('/reset-password' as any);
          }
        }
      }
    };

    // Listen for deep links when app is open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Handle deep link when app opens from closed state
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="restaurant/[id]" />
          <Stack.Screen name="tracking" />
        </Stack>
      </CartProvider>
    </SafeAreaProvider>
  );
}