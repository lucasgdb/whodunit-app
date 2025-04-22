import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { portStore } from "@/stores/port.store";
import { getAvailablePort } from "@/network/host";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const setPort = portStore((store) => store.setPort);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function getPort() {
      const availablePort = await getAvailablePort();
      setPort(availablePort);
    }

    getPort();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(game)" options={{ headerShown: false }} />

        <Stack.Screen name="(locally)" options={{ headerShown: false }} />

        <Stack.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
