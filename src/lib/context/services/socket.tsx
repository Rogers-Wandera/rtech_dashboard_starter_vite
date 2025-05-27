import { useAuth } from "@/hooks/auth/auth.hooks";
import {
  SocketConnection,
  useSocketConnection,
} from "@/hooks/services/useSocketConnection";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SocketProps {
  children: ReactNode;
}

type SocketContextType = {
  getSocket: (namespace: string) => SocketConnection | null;
  createConnection: (namespace: string, options?: any) => void;
  removeConnection: (namespace: string) => void;
  connections: Record<string, SocketConnection>;
};

export const SocketContext = createContext<SocketContextType>({
  getSocket: () => null,
  createConnection: () => {},
  removeConnection: () => {},
  connections: {},
});

export const SocketProvider: React.FC<SocketProps> = ({ children }) => {
  const socketToken = import.meta.env.VITE_SOCKET_TOKEN as string;
  const { user, isLoggedIn, token, sessionId } = useAuth();
  const [connections, setConnections] = useState<
    Record<string, SocketConnection>
  >({});

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

  const mainSocket = useSocketConnection({
    enabled: true,
    namespace: "",
    options: { auth: mainAuth, reconnectionAttempts: Infinity },
    callbacks: {
      onConnect: (socket) => {
        if (socket.connected) {
          console.log("Main socket connected");
          socket.on("call_connection", () => {
            if (user) {
              if (!userSocket?.socket?.connected) {
                userSocket.connect();
              }
            }
          });
        }
      },
    },
  });

  const userSocket = useSocketConnection({
    enabled: isLoggedIn,
    namespace: "user",
    options: { auth: userAuth, reconnectionAttempts: Infinity },
    callbacks: {
      afterConnect: (socket) => {
        if (socket.connected) {
          console.log("User socket connected");
          mainSocket?.socket?.emit("socket_session", {
            sessionId,
          });
        }
      },
    },
  });

  const createConnection = (
    namespace: string,
    connection: SocketConnection
  ) => {
    if (connections[namespace]) return;
    setConnections((prev) => ({
      ...prev,
      [namespace]: connection,
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

  const getSocket = useCallback(
    (namespace: string): SocketConnection | null => {
      if (namespace === "main") {
        return mainSocket;
      } else if (namespace === "user") {
        return userSocket;
      }
      return connections[namespace] || null;
    },
    [connections, mainSocket, userSocket]
  );

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

export const useSocket = (namespace = "main"): SocketConnection | null => {
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
    getSocket: context.getSocket,
    getMainSocket: () => context.getSocket("main"),
  };
};
