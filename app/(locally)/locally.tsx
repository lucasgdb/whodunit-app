import { CreateRoomButton } from "@/components/CreateRoomButton";
import RoomList from "@/components/RoomList";
import { StyleSheet, Text, View } from "react-native";

export default function LocallyScreeen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar lobby</Text>

      <View style={styles.actionsContainer}>
        <CreateRoomButton />
      </View>

      <RoomList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 8,
  },
});
