import { userStore } from "@/stores/user.store";
import { Link } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const { user, setUsername } = userStore();

  const handleChangeUsername = (username: string) => setUsername(username);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao WhoDunit!</Text>

      <View style={styles.inputContainer}>
        <Text>Digite seu nome:</Text>
        <TextInput
          placeholder="Nome"
          value={user.name}
          onChangeText={handleChangeUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Link href="/(game)" asChild>
          <Button title="Online" disabled />
        </Link>

        <Link href="/(locally)" asChild>
          <Button title="Local" disabled={user.name.length < 4} />
        </Link>
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
  inputContainer: {
    marginTop: 24,
    gap: 8,
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
