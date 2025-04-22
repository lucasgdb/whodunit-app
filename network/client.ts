import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";

export const connectToServer = (ip: string, port: number = 41234) => {
  const client = TcpSocket.createConnection({ host: ip, port: port }, () => {
    // Conectou com sucesso
    console.log("Conectado ao servidor");
  });

  client.on("data", (data) => {
    // Lógica para lidar com dados recebidos do servidor
    console.log("Dados recebidos do servidor: ", data.toString());
  });

  client.on("error", (error) => {
    // Lidar com erros
    console.error("Erro ao conectar ao servidor: ", error);
    Alert.alert("Erro", "Não foi possível conectar ao servidor");
  });

  client.on("close", () => {
    console.log("Conexão fechada");
  });

  return client; // Pode retornar o cliente caso precise gerenciar a conexão em outro lugar
};
