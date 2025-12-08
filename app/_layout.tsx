import { backgroundFetchService } from '@/services/backgroundFetchService';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Khởi tạo background fetch khi app start
    backgroundFetchService.registerBackgroundFetch(120);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
