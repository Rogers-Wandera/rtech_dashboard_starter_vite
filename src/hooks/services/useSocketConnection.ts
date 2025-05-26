import { useCallback, useEffect, useRef, useState } from "react";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export interface SocketProps {
  namespace?: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  error?: string | null;
  enabled?: boolean;
  dependencies?: any[];
}

interface SocketState {
  socket: Socket | null;
  error: string | null;
  isConnected: boolean;
  isReconnecting: boolean;
  retryCount: number;
  reconnect: boolean;
}

const initialState: SocketState = {
  socket: null,
  error: null,
  isConnected: false,
  isReconnecting: false,
  retryCount: 0,
  reconnect: false,
};

export const useSocketConnection = (props: SocketProps) => {
  const {
    namespace: initialNamespace = "",
    options,
    enabled = true,
    dependencies = [],
  } = props;

  const namespace = initialNamespace.replace("/", "");
  const socketUrl = `${import.meta.env.VITE_SERVER_URL}`;
  const socketRef = useRef<Socket | null>(null);

  const [state, setState] = useState<SocketState>(initialState);

  const [manualReconnectAttempt, setManualReconnectAttempt] = useState(0);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState((prev) => ({
        ...prev,
        socket: null,
        isConnected: false,
        isReconnecting: false,
        error: "Disconnected by client",
      }));
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled || socketRef.current) return;

    disconnect();

    setState((prev) => ({ ...prev, error: null, isReconnecting: false }));
    const socket = io(socketUrl + "/" + namespace, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      ...options,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setState((prev) => ({
        ...prev,
        socket,
        isConnected: true,
        isReconnecting: false,
        retryCount: 0,
        error: null,
      }));
    });
    socket.on("connect_error", (err) => {
      setState((prev) => ({
        ...prev,
        error: err.message,
        isConnected: false,
      }));
    });

    socket.on("custom-ping", (data) => {
      socket.emit("custom-pong", {
        timestamp: data.timestamp,
      });
    });

    socket.on("disconnect", (reason) => {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        error:
          reason === "io server disconnect" ? "Disconnected by server" : null,
      }));
    });

    socket.on("reconnect_attempt", (attempt) => {
      setState((prev) => ({
        ...prev,
        isReconnecting: true,
        retryCount: attempt,
      }));
    });

    socket.on("reconnect_failed", () => {
      setState((prev) => ({
        ...prev,
        isReconnecting: false,
        error: "Failed to reconnect after maximum attempts",
      }));
    });

    setState((prev) => ({ ...prev, socket }));

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("reconnect_attempt");
      socket.off("reconnect_failed");
      socket.off("custom-ping");
      socket.off("custom-pong");
    };
  }, [enabled, namespace, options]);

  const manualReconnect = useCallback(() => {
    disconnect();
    setManualReconnectAttempt((prev) => prev + 1);
  }, [disconnect]);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, ...dependencies]);

  useEffect(() => {
    if (manualReconnectAttempt > 0) {
      connect();
    }
  }, [manualReconnectAttempt, connect]);

  return {
    ...state,
    connect,
    disconnect,
    reconnect: manualReconnect,
  };
};
