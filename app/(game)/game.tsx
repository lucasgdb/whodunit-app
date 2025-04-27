import UserList from "@/components/UserList";
import { StyleSheet, Text, View } from "react-native";

export default function GameScreeen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sala do jogo</Text>
      </View>

      <UserList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 8,
  },
});
