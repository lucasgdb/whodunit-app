import { Stack } from "expo-router";

export default function LocallyLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Local",
          }}
        />
      </Stack>
    </>
  );
}
