import { Stack } from "expo-router";

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="game"
        options={{
          title: "Jogo",
        }}
      />
    </Stack>
  );
}
