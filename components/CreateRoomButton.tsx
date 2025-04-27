import { CreateRoomSheet } from "./CreateRoomSheet";
import Icon from "react-native-vector-icons/FontAwesome";
import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { roomsStore } from "@/stores/rooms.store";
import { userStore } from "@/stores/user.store";

export function CreateRoomButton() {
  const rooms = roomsStore((store) => store.rooms);
  const user = userStore((store) => store.user);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  };

  const disabled = rooms.some((room) => room.id === user.id);

  return (
    <>
      <Icon.Button
        name="plus"
        backgroundColor={disabled ? "#aaa" : "#3b5998"}
        onPress={handlePresentModalPress}
        disabled={disabled}
        style={{ justifyContent: "center" }}
      >
        Criar lobby
      </Icon.Button>

      <CreateRoomSheet onClose={handleClose} ref={bottomSheetModalRef} />
    </>
  );
}
