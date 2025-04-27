import { Stack } from "expo-router";

export default function LobbyLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="lobby"
        options={{
          title: "Lobby",
        }}
      />
    </Stack>
  );
}
