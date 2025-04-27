import { UserList } from "@/components/UserList";
import { useNetwork } from "@/hooks/useNetwork";
import { disconnectFromServer } from "@/network/client";
import { roomStore } from "@/stores/room.store";
import { userStore } from "@/stores/user.store";
import { User } from "@/types/User";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default function LobbyScreeen() {
  const { closeRoom } = useNetwork();

  const user = userStore((store) => store.user);
  const users = roomStore((store) => store.users);
  const room = roomStore((store) => store.room);

  const handleBack = () => {
    if (user.id === room?.id) {
      closeRoom();
      return;
    }

    disconnectFromServer();
  };

  const getIsHost = (user: User) => user.id === room?.id;

  const canStart = users.length >= 4;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Aguardando jogadores</Text>

        <Icon
          name="close"
          onPress={handleBack}
          size={24}
          color="#ef4444"
          style={{ justifyContent: "center" }}
        />
      </View>

      <UserList />

      {getIsHost(user) && (
        <View style={styles.actionsContainer}>
          <MaterialIcon.Button
            name="play-arrow"
            backgroundColor={!canStart ? "#aaa" : "#3b5998"}
            style={{ justifyContent: "center" }}
            disabled={!canStart}
          >
            Iniciar jogo
          </MaterialIcon.Button>
        </View>
      )}
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
  },
});
