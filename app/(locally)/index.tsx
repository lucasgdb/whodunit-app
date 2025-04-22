import RoomList from "@/components/RoomList";
import { Link } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LocallyScreeen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogar localmente</Text>

      <View style={styles.actionsContainer}>
        <Link href="/(game)" asChild>
          <Button title="Criar sala" />
        </Link>
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
