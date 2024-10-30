import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  )
}

export default _layout