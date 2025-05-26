import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSocketConnection } from "@/hooks/services/useSocketConnection";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket } from "socket.io-client";

export interface SocketProps {
  children: ReactNode;
}

interface SocketState {
  socket: Socket | null;
  error: string | null;
  isConnected: boolean;
  isReconnecting: boolean;
  retryCount: number;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

type SocketContextType = {
  getSocket: (namespace: string) => SocketState | null;
  createConnection: (namespace: string, options?: any) => void;
  removeConnection: (namespace: string) => void;
  connections: Record<string, SocketState>;
};

const SocketContext = createContext<SocketContextType>({
  getSocket: () => null,
  createConnection: () => {},
  removeConnection: () => {},
  connections: {},
});

export const SocketProvider: React.FC<SocketProps> = ({ children }) => {
  const socketToken = import.meta.env.VITE_SOCKET_TOKEN as string;
  const { user, isLoggedIn, token } = useAuth();
  const [connections, setConnections] = useState<Record<string, SocketState>>(
    {}
  );

  const userAuth = useMemo(
    () => ({
      token: socketToken,
      connectionId: "user:" + user?.id,
      jwt: token,
    }),
    [socketToken, user?.id]
  );
  const mainAuth = useMemo(
    () => ({
      token: socketToken,
      connectionId: "main:socket",
    }),
    [socketToken]
  );

  const userSocket = useSocketConnection({
    enabled: isLoggedIn,
    namespace: "user",
    options: { auth: userAuth, reconnectionAttempts: Infinity },
  });

  const mainSocket = useSocketConnection({
    enabled: true,
    namespace: "",
    options: { auth: mainAuth, reconnectionAttempts: Infinity },
  });

  const createConnection = (namespace: string, options: any = {}) => {
    if (connections[namespace]) return;

    const newSocket = useSocketConnection({
      enabled: true,
      namespace,
      options: {
        auth: userAuth,
        ...options,
      },
    });

    setConnections((prev) => ({
      ...prev,
      [namespace]: newSocket,
    }));
  };

  const removeConnection = (namespace: string) => {
    setConnections((prev) => {
      const newConnections = { ...prev };
      if (newConnections[namespace]) {
        newConnections[namespace].disconnect();
        delete newConnections[namespace];
      }
      return newConnections;
    });
  };

  const getSocket = (namespace: string) => {
    return connections[namespace] || null;
  };

  useEffect(() => {
    if (isLoggedIn) {
      setConnections((prev) => ({
        ...prev,
        user: userSocket,
      }));
    } else {
      setConnections((prev) => {
        const newConnections = { ...prev };
        delete newConnections?.user;
        return newConnections;
      });
    }
  }, [isLoggedIn, userSocket.isConnected, userSocket.error, userSocket.socket]);

  useEffect(() => {
    setConnections((prev) => ({
      ...prev,
      main: mainSocket,
    }));
  }, [mainSocket.isConnected, mainSocket.error, mainSocket.socket]);

  const contextValue = {
    getSocket,
    createConnection,
    removeConnection,
    connections,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (namespace = "main"): SocketState | null => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.getSocket(namespace) || null;
};

export const useSocketManager = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketManager must be used within a SocketProvider");
  }
  return {
    createConnection: context.createConnection,
    removeConnection: context.removeConnection,
    connections: context.connections,
  };
};
