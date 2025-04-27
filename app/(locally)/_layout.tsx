import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function LocallyLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="locally"
        options={{
          title: "Jogar localmente",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/")}
              style={{ paddingRight: 16 }}
            >
              <Ionicons name="arrow-back" size={24} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
