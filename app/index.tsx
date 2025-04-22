import { userStore } from "@/stores/user.store";
import { Link } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const { username, setUsername } = userStore();

  const handleChangeUsername = (value: string) => setUsername(value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao WhoDunit!</Text>

      <View style={styles.inputContainer}>
        <Text>Digite seu nome:</Text>
        <TextInput
          placeholder="Nome"
          value={username}
          onChangeText={handleChangeUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Link href="/(game)" asChild>
          <Button title="Online" disabled />
        </Link>

        <Link href="/(locally)" asChild>
          <Button title="Local" disabled={username.length < 4} />
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
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 8,
  },
});
