import { helpers } from "@/lib/utils/helpers/helper";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (
  url: string,
  options?: Partial<ManagerOptions & SocketOptions>
) => {
  if (!socket) {
    socket = io(url, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      ...options,
    });
    if (helpers.checkEnviroment().isDevelopment) {
      socket.on("connect", () => {
        console.log("WebSocket connected:", socket?.id);
      });

      socket.on("AuthError", (msg: string) => {
        console.log(msg);
      });

      socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
      });

      socket.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });
      socket.on("reconnect_failed", () => {
        console.warn("Reconnection failed after multiple attempts.");
      });

      socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${reason}`);
      });
    }
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    if (helpers.checkEnviroment().isDevelopment) {
      console.log("Disconnecting socket:", socket.id);
    }
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  if (!socket) {
    console.warn("Socket not connected!");
  }
  return socket;
};
