import { roomStore } from "@/stores/room.store";
import { User } from "@/types/User";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function UserList() {
  const users = roomStore((store) => store.users);
  const room = roomStore((store) => store.room);

  const getIsHost = (user: User) => user.id === room?.id;

  const canStart = users.length >= 4;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogadores conectados</Text>

      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.userName}>
                {getIsHost(item) ? "Host" : "Jogador"} - {item.name}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyWarning}>Não há nenhum usuário conectado</Text>
      )}

      {users.some(getIsHost) && (
        <View style={styles.actionsContainer}>
          <Icon.Button
            name="play-arrow"
            backgroundColor={!canStart ? "#9a9a9a" : "#3b5998"}
            style={{ justifyContent: "center" }}
            disabled={!canStart}
          >
            Iniciar jogo
          </Icon.Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
  },
  userName: {
    fontSize: 18,
    color: "#666",
  },
  emptyWarning: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 24,
  },
});
