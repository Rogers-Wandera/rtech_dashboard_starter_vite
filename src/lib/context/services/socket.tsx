import {
  connectSocket,
  disconnectSocket,
} from "@/lib/services/socket/socket.service";
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
}

interface SocketState {
  socket: Socket | null;
  error: string | null;
  isConnected: boolean;
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
  });

  useEffect(() => {
    let isMounted = true;
    const socket = connectSocket(url, options);

    socket.on("connect", () => {
      if (isMounted) {
        setState({ socket, error: null, isConnected: true });
      }
    });

    socket.on("connect_error", (err) => {
      if (isMounted) {
        setState({
          socket: null,
          error: `Socket error: ${err.message}`,
          isConnected: false,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      if (isMounted) {
        setState({
          socket: null,
          error: `Socket Disconnected: ${reason}`,
          isConnected: false,
        });
      }
    });
    return () => {
      isMounted = false;
      disconnectSocket();
    };
  }, [url, options]);
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
