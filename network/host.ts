import dgram from "react-native-udp";
import TcpSocket from "react-native-tcp-socket";
import { NetworkInfo } from "react-native-network-info";

export const startBroadcast = async (username: string, port: number) => {
  const socket = dgram.createSocket({
    type: "udp4",
  });

  const ip = await NetworkInfo.getIPV4Address();

  let interval: NodeJS.Timeout | undefined;

  const message = `ROOM_CREATE|${username}|${ip}|${port}`;

  interval = setInterval(() => {
    socket.send(
      message,
      0,
      message.length,
      port, // porta de broadcast
      "255.255.255.255", // enviar para todos na rede
      (err) => {
        if (err) console.error("Erro ao enviar broadcast:", err);
      }
    );
  }, 1000);

  socket.once("listening", () => {
    socket.setBroadcast(true);
  });

  socket.on("message", (msg, rinfo) => {
    console.log(`Mensagem recebida: ${msg}`);
    // Seu código de tratamento de mensagens
  });

  socket.bind(port);

  return {
    socket,
    interval,
    ip,
  };
};

export function createServer(ip: string, port: number) {
  const server = TcpSocket.createServer((socket) => {
    console.log("Novo cliente conectado");

    // Quando um cliente envia uma mensagem
    socket.on("data", (data) => {
      console.log("Mensagem recebida:", data.toString());

      // Envia uma resposta para todos os clientes conectados
      socket.write("Sala criada com sucesso!");
    });

    // Quando a conexão é fechada
    socket.on("close", () => {
      console.log("Conexão fechada");
    });

    // Em caso de erro
    socket.on("error", (err) => {
      console.error("Erro no socket:", err);
    });
  });

  // Iniciar o servidor na porta 12345 (pode ser qualquer porta não utilizada)
  server.listen(
    {
      port,
      host: ip,
    },
    () => {
      console.log("Servidor TCP aguardando conexões...");
    }
  );

  return server;
}

export function getAvailablePort() {
  const server = dgram.createSocket({
    type: "udp4",
  });

  return new Promise<number>((res, rej) => {
    server.on("error", () => {
      res(getAvailablePort());
    });

    server.on("listening", () => {
      const address = server.address();
      console.log(`Porta disponível encontrada: ${address.port}`);
      server.close();
      res(address.port);
    });

    const porta = Math.floor(Math.random() * (65535 - 49152 + 1)) + 49152;
    server.bind(porta);
  });

  // Tentar escutar uma porta aleatória (por exemplo, entre 49152 e 65535)
}
