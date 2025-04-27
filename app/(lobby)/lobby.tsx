import UserList from "@/components/UserList";
import { useNetwork } from "@/hooks/useNetwork";
import { disconnectFromServer } from "@/network/client";
import { roomStore } from "@/stores/room.store";
import { userStore } from "@/stores/user.store";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LobbyScreeen() {
  const { closeRoom } = useNetwork();

  const setRoom = roomStore((store) => store.setRoom);
  const user = userStore((store) => store.user);
  const room = roomStore((store) => store.room);

  const handleBack = () => {
    setRoom(null);

    if (user.id === room?.id) {
      setRoom(null);
      closeRoom();
      return;
    }

    disconnectFromServer();
  };

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
