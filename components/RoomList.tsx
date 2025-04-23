import { useBroadcast } from "@/hooks/useBroadcast";
import { useNetwork } from "@/hooks/useNetwork";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function RoomList() {
  useBroadcast();

  const router = useRouter();

  const { rooms, connectToServer } = useNetwork();

  const handleJoin = (ip: string, port: number) => {
    connectToServer(ip, port).once("connect", () => {
      router.push("/(game)");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas disponíveis:</Text>

      {rooms.length > 0 ? (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.ip}
          renderItem={({ item }) => (
            <View style={styles.roomContainer}>
              <Text style={styles.roomName}>Sala de {item.name}</Text>

              <Icon.Button
                name="chevron-right"
                backgroundColor="#3b5998"
                onPress={() => handleJoin(item.ip, item.port)}
                style={{ paddingHorizontal: 12 }}
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
