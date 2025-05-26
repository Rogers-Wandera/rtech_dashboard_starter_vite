import { helpers } from "@/lib/utils/helpers/helper";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

type ConnectionCallbacks = {
  onConnectionLost?: (errorMsg: string) => void;
  onRetry?: (attempt: number) => void;
  onAuthError?: (msg: string) => void;
  onConnect?: (socket: Socket | null) => void;
  onDisconnect?: (reason: Socket.DisconnectReason) => void;
};

type connectionProps = {
  url: string;
  namespace?: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  retryCount?: number;
} & ConnectionCallbacks;

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 1000;

let sockets: Map<string, Socket> = new Map();

/**
 * Get socket instance by URL and namespace
 */
export const getSocket = (
  url: string,
  namespace: string = ""
): Socket | null => {
  const socketKey = createSocketKey(url, namespace);
  return sockets.get(socketKey) || null;
};

const createSocketKey = (url: string, namespace: string): string => {
  return `${url}/${namespace}`.replace(/\/+/g, "/");
};

const createSocketUrl = (url: string, namespace: string): string => {
  return `${url}/${namespace}`.replace(/\/+/g, "/");
};

/**
 * Connect to WebSocket server with retry logic
 */
export const connectSocket = (props: connectionProps) => {
  const { url, namespace = "", options, retryCount = 0 } = props;
  const socketKey = createSocketKey(url, namespace);
  const isDev = helpers.checkEnviroment().isDevelopment;
  const socketUrl = createSocketUrl(url, namespace);
  let socket = getSocket(url, namespace);

  console.log(socketUrl);

  if (!socket) {
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: MAX_RETRIES,
      reconnectionDelay: RETRY_INTERVAL,
      transports: ["websocket"],
      ...options,
    });
    setupSocketListeners(socket, props, isDev, retryCount);
    sockets.set(socketKey, socket);
    sockets.set(props.url, socket);
  }
  return socket;
};

/**
 * Disconnect the socket
 */

export const disconnectSocket = (url: string, namespace: string = ""): void => {
  const socket = getSocket(url, namespace);
  const key = `${url}/${namespace}`;
  if (socket) {
    if (helpers.checkEnviroment().isDevelopment) {
      console.log("Disconnecting socket:", socket.id);
    }
    socket.removeAllListeners();
    socket.disconnect();
    sockets.delete(key);
  }
};

const handleConnectionError = (
  callbacks: ConnectionCallbacks,
  error: string,
  retryCount: number
): void => {
  const { onConnectionLost, onRetry } = callbacks;
  const attempts = retryCount || 0;

  if (attempts < MAX_RETRIES) {
    onRetry?.(attempts + 1);
  } else {
    const errorMsg = `Max retry attempts reached. Unable to reconnect to the server. ${error}`;
    onConnectionLost?.(errorMsg);
  }
};

const setupSocketListeners = (
  socket: Socket,
  callbacks: ConnectionCallbacks,
  isDev: boolean,
  retryCount: number
): void => {
  const { onConnect, onAuthError, onConnectionLost, onDisconnect, onRetry } =
    callbacks;

  socket.on("connect", () => {
    if (isDev) {
      console.log("WebSocket connected:", socket.id);
    }
    onConnect?.(socket);
    retryCount = 0;
  });

  socket.on("AuthError", (msg: string) => {
    onAuthError?.(msg);
  });

  socket.on("connect_error", (err) => {
    if (isDev) {
      console.error("Connection error:", err.message);
    }
    handleConnectionError(callbacks, err.message, retryCount);
  });

  socket.on("reconnect_attempt", () => {
    if (isDev) {
      console.log("Attempting to reconnect...");
    }
    onRetry?.(retryCount || 0);
  });

  socket.on("reconnect_failed", () => {
    if (isDev) {
      console.warn("Reconnection failed after multiple attempts.");
    }
    onConnectionLost?.("Reconnection failed after multiple attempts.");
  });

  socket.on("disconnect", (reason) => {
    if (isDev) {
      console.warn(`Socket disconnected: ${reason}`);
    }
    onDisconnect?.(reason);

    if (reason !== "io client disconnect") {
      handleConnectionError(callbacks, reason, retryCount);
    }
  });
};
