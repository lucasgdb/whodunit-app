import { userStore } from "@/stores/user.store";
import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HomeScreen() {
  const { user, setUsername } = userStore();

  const handleChangeUsername = (username: string) => setUsername(username);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seja bem-vindo</Text>

      <View style={styles.inputContainer}>
        <Text>Seu nome *</Text>
        <TextInput placeholder="Nome" value={user.name} onChangeText={handleChangeUsername} style={styles.input} />
      </View>

      <View style={styles.actionsContainer}>
        <Link href="/(locally)/locally" replace asChild>
          <Icon.Button name="signal-wifi-0-bar" backgroundColor="#aaa" style={{ justifyContent: "center" }} disabled>
            Online
          </Icon.Button>
        </Link>

        <Link href="/(locally)/locally" replace asChild>
          <Icon.Button
            name="signal-cellular-alt"
            backgroundColor={user.name.length < 4 ? "#aaa" : "#3b5998"}
            disabled={user.name.length < 4}
            style={{ justifyContent: "center" }}
          >
            Local
          </Icon.Button>
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
