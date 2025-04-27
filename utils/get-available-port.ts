import dgram from "react-native-udp";

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
