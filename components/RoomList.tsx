import { useNetwork } from "@/hooks/useNetwork";
import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

export default function RoomList() {
  const { rooms, connectToServer } = useNetwork();

  const handleJoin = (ip: string, port: number) => connectToServer(ip, port);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas disponíveis:</Text>

      {rooms.length > 0 ? (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.ip}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8 }}>
              <Button
                title={`Sala - ${item.name}`}
                onPress={() => handleJoin(item.ip, item.port)}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyWarning}>Não há nenhuma sala criada</Text>
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
