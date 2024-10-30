import React, { useEffect, useState } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';

function Layout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName='(tabs)'>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  )
}

export default Layout