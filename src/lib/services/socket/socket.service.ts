import { helpers } from "@/lib/utils/helpers/helper";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

let socket: Socket | null = null;
let retryCount = 0;
const maxRetries = 5;
const retryInterval = 1000;

type connectionProps = {
  url: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  onConnectionLost?: (errorMsg: string) => void;
  onRetry?: (attempt: number) => void;
  onAuthError?: (msg: string) => void;
  onConnect?: (socket: Socket | null) => void;
  onDisconnect?: (reason: Socket.DisconnectReason) => void;
  retryCount?: number;
};

/**
 * Connect to the WebSocket server with retry logic
 * @param url - The WebSocket server URL
 * @param options - Optional configuration for the connection
 * @param onConnectionLost - Callback for when the connection is lost
 * @param onRetry - Callback for notifying retries
 * @returns The connected socket instance
 */
export const connectSocket = (props: connectionProps) => {
  if (!socket) {
    socket = io(props.url, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      ...props?.options,
    });
    const isDev = helpers.checkEnviroment().isDevelopment;

    socket.on("connect", () => {
      if (isDev) {
        console.log("WebSocket connected:", socket?.id);
      }
      props?.onConnect?.(socket);
      retryCount = 0;
    });

    socket.on("AuthError", (msg: string) => {
      props?.onAuthError?.(msg);
    });

    socket.on("connect_error", (err) => {
      if (isDev) {
        console.error("Connection error:", err.message);
      }
      retryConnection({
        ...props,
        onConnectionLost: () => {
          props?.onConnectionLost?.(
            "Connection error: " +
              err.message +
              " " +
              `[Max retry attempts reached. Unable to reconnect to the server, service check ongoing.]`
          );
        },
      });
    });

    socket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });
    socket.on("reconnect_failed", () => {
      console.warn("Reconnection failed after multiple attempts.");
    });

    socket.on("disconnect", (reason) => {
      if (isDev) {
        console.warn(`Socket disconnected: ${reason}`);
      }
      props?.onDisconnect?.(reason);
      if (reason !== "io client disconnect") {
        retryConnection({
          ...props,
          onConnectionLost: () => {
            props?.onConnectionLost?.("Connection lost: " + reason);
          },
        });
      }
    });
  }
  return socket;
};

/**
 * Retry connection to the WebSocket server
 * @param url - The WebSocket server URL
 * @param options - Optional configuration for the connection
 * @param onConnectionLost - Callback for when the connection is lost
 * @param onRetry - Callback for notifying retries
 */
const retryConnection = (props: connectionProps) => {
  retryCount = props?.retryCount ? props.retryCount : retryCount;
  if (retryCount < maxRetries) {
    retryCount++;
    props?.onRetry?.(retryCount);

    setTimeout(() => {
      connectSocket(props);
    }, retryInterval);
  } else {
    props?.onConnectionLost?.(
      "Max retry attempts reached. Unable to reconnect."
    );
  }
};

/**
 * Disconnect the socket
 */

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
