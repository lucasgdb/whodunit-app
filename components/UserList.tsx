import { useNetwork } from "@/hooks/useNetwork";
import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

export default function UserList() {
  const { users, connectToServer } = useNetwork();

  const handleJoin = (ip: string, port: number) => connectToServer(ip, port);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários conectados:</Text>

      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.userName}>
                Usuário conectado - {item.name}
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
    fontSize: 16,
    color: "#666",
  },
  emptyWarning: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 8,
  },
});
