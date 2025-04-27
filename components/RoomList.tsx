import { useBroadcast } from "@/hooks/useBroadcast";
import { useNetwork } from "@/hooks/useNetwork";
import { roomsStore } from "@/stores/rooms.store";
import { Room } from "@/types/Room";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function RoomList() {
  useBroadcast();

  const rooms = roomsStore((store) => store.rooms);

  const { connectToHost } = useNetwork();

  const handleJoin = (room: Room) => {
    connectToHost(room);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lobbies disponíveis</Text>

      {rooms.length > 0 ? (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.ip}
          renderItem={({ item }) => (
            <View style={styles.roomContainer}>
              <Text style={styles.roomName}>Sala de {item.owner}</Text>

              <Icon.Button
                name="chevron-right"
                backgroundColor="#3b5998"
                onPress={() => handleJoin(item)}
              >
                Entrar
              </Icon.Button>
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
  roomContainer: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  roomName: {
    fontSize: 18,
    color: "#666",
  },
  emptyWarning: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 8,
  },
});
