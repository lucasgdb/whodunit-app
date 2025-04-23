export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; // Gera um número aleatório entre 0 e 15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // Garante a versão 4 (em "y")
    return v.toString(16); // Converte para hexadecimal
  });
};
