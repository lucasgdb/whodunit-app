import { useNetwork } from "@/hooks/useNetwork";
import { Button, Text, View } from "react-native";

export default function GameScreeen() {
  const { createRoom } = useNetwork();

  return (
    <View>
      <Text>Sala do jogo!</Text>
      <Button onPress={createRoom} title="Criar jogo" />
    </View>
  );
}
