import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/services/socket/socket.service";
import { helpers } from "@/lib/utils/helpers/helper";
import { notifier } from "@/lib/utils/notify/notification";
import { useInterval } from "@mantine/hooks";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export interface SocketProps {
  children: ReactNode;
  url: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  error?: string | null;
}

interface SocketState {
  socket: Socket | null;
  error: string | null;
  isConnected: boolean;
  isReconnecting: boolean;
  retryCount: number;
  reconnect: boolean;
}

const SocketContext = createContext<SocketState | null>(null);

export const SocketProvider: React.FC<SocketProps> = ({
  children,
  url,
  options,
}) => {
  const [state, setState] = useState<SocketState>({
    socket: null,
    error: null,
    isConnected: false,
    isReconnecting: false,
    retryCount: 0,
    reconnect: false,
  });

  const interval = useInterval(() => HandleServiceCheck(), 8000);

  const HandleServiceCheck = () => {
    const socket = getSocket();
    if (!state.isConnected && !state.isReconnecting && socket) {
      if (helpers.checkEnviroment().isDevelopment) {
        console.log("Service check: Attempting to reconnect...");
      }
      socket.connect();
      setState((prev) => ({ ...prev, reconnect: true }));
    }
  };

  const handleConnectionLost = (error: string) => {
    setState((prevState) => ({
      ...prevState,
      socket: null,
      isReconnecting: prevState.retryCount === 5 ? false : true,
      isConnected: false,
      error: error,
      reconnect: false,
    }));
  };

  const retryConnect = (retryCount: number) => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      retryCount,
      error: `Attempting to Retry connection... Attempt ${retryCount}`,
      isReconnecting: retryCount === 5 ? false : true,
    }));
  };

  const onConnect = (socket: Socket | null) => {
    if (state.reconnect) {
      notifier.info({
        message: "Connection restored!",
        title: "Service Check",
      });
    }
    setState((prev) => ({
      ...prev,
      socket: socket,
      error: null,
      isConnected: true,
      isReconnecting: false,
      retryCount: 0,
      reconnect: false,
    }));
  };

  const onDisconnect = (reason: string) => {
    setState((prevState) => ({
      ...prevState,
      socket: null,
      error: `Server connection lost: ${reason}`,
      isConnected: false,
      reconnect: false,
    }));
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      connectSocket({
        url,
        options,
        onConnectionLost: handleConnectionLost,
        onRetry: retryConnect,
        onConnect,
        onDisconnect,
      });
    }
    return () => {
      isMounted = false;
      disconnectSocket();
    };
  }, [url, options]);

  useEffect(() => {
    interval.start();
    return () => interval.stop();
  }, [state]);
  return (
    <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketState | null => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
