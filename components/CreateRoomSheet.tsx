import { useNetwork } from "@/hooks/useNetwork";
import { portStore } from "@/stores/port.store";
import { userStore } from "@/stores/user.store";
import { Room } from "@/types/Room";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type Props = {
  onClose: () => void;
};

export const CreateRoomSheet = forwardRef<BottomSheetModal, Props>(
  function CreateRoomSheet({ onClose }, ref) {
    const [roomName, setRoomName] = useState("");

    const { createRoom } = useNetwork();

    const user = userStore((store) => store.user);
    const port = portStore((store) => store.port);

    const handleCreateRoom = () => {
      const room: Room = {
        id: user.id,
        name: roomName || user.name,
        owner: user.name,
        ip: user.ip,
        port,
      };

      createRoom(room, onClose);
    };

    return (
      <BottomSheetModal backdropComponent={BackdropComponent} ref={ref}>
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Configurar novo lobby</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text>Digite o nome da sala:</Text>
                <TextInput
                  placeholder={user.name}
                  style={styles.input}
                  value={roomName}
                  onChangeText={setRoomName}
                />
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <Icon.Button
                name="plus"
                backgroundColor="#3b5998"
                onPress={handleCreateRoom}
                style={{ justifyContent: "center" }}
              >
                Criar lobby
              </Icon.Button>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

function BackdropComponent(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
  },
  formContainer: {
    marginTop: 24,
    gap: 16,
  },
  inputContainer: {
    gap: 4,
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
