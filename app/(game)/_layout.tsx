import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Stack } from "expo-router";

export default function GameLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Game",
          }}
        />
      </Stack>
    </>
  );
}
