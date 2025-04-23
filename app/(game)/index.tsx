import UserList from "@/components/UserList";
import { useNetwork } from "@/hooks/useNetwork";
import { Button, StyleSheet, Text, View } from "react-native";

export default function GameScreeen() {
  const {} = useNetwork();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala do jogo</Text>

      <UserList />
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
