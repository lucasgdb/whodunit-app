import { useNetwork } from "@/hooks/useNetwork";
import { userStore } from "@/stores/user.store";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateRoomScreeen() {
  const { createRoom } = useNetwork();

  const user = userStore((store) => store.user);

  const router = useRouter();

  const handleCreateRoom = async () => {
    await createRoom();
    router.push("/(game)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar nova sala</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text>Digite o nome:</Text>
          <TextInput placeholder={user.name} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text>Quantidade de jogadores:</Text>
          <TextInput placeholder="6" style={styles.input} />
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Button onPress={handleCreateRoom} title="Criar sala" />
      </View>
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
  formContainer: {
    marginTop: 24,
    gap: 16,
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 8,
  },
});
