import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="currency" />
      <Stack.Screen name="data-export" />
      <Stack.Screen name="backup" />
      <Stack.Screen name="help" />
      <Stack.Screen name="contact" />
    </Stack>
  );
}