import "react-native-gesture-handler";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { portStore } from "@/stores/port.store";
import { getAvailablePort } from "@/utils/get-available-port";
import { NetworkInfo } from "react-native-network-info";
import { userStore } from "@/stores/user.store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const setPort = portStore((store) => store.setPort);
  const setIp = userStore((store) => store.setIp);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function configureUser() {
      const availablePort = await getAvailablePort();
      setPort(availablePort);

      const ip = await NetworkInfo.getIPV4Address();
      if (ip) setIp(ip);
    }

    configureUser();
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <GestureHandlerRootView style={styles.container}>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="(locally)" options={{ headerShown: false }} />

              <Stack.Screen name="(lobby)" options={{ headerShown: false }} />

              <Stack.Screen name="(game)" options={{ headerShown: false }} />

              <Stack.Screen
                name="index"
                options={{
                  title: "WhoDunit",
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
