import { roomStore } from "@/stores/room.store";
import { User } from "@/types/User";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export function UserList() {
  const users = roomStore((store) => store.users);
  const room = roomStore((store) => store.room);

  const getIsHost = (user: User) => user.id === room?.id;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogadores conectados ({users.length})</Text>

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
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 24,
  },
});
