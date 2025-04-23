import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Stack } from "expo-router";

export default function CreateRoomLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Criar sala",
          }}
        />
      </Stack>
    </>
  );
}
