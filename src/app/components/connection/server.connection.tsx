import { useEffect, useRef, useState } from "react";
import { Notification } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { IconX, IconCheck } from "@tabler/icons-react";
import { useSocket } from "@/lib/context/services/socket";

function SocketConnectionNotifier() {
  const socket = useSocket("main");
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);
  const userDismissedRef = useRef(false);
  const wasConnectedRef = useRef(true);

  const checkConnectionInterval = useInterval(() => {
    if (socket?.socket?.connected) {
      setShowOnline(true);
      setShowOffline(false);
      userDismissedRef.current = false;
      checkConnectionInterval.stop();
      setTimeout(() => setShowOnline(false), 3000);
    } else if (userDismissedRef.current) {
      setShowOffline(true);
      userDismissedRef.current = false;
      checkConnectionInterval.stop();
    }
  }, 10000);

  useEffect(() => {
    if (!socket?.socket) return;

    const onConnect = () => {
      setShowOnline(true);
      setShowOffline(false);
      userDismissedRef.current = false;
      wasConnectedRef.current = true;
      checkConnectionInterval.stop();
      setTimeout(() => setShowOnline(false), 3000);
    };

    const onDisconnect = () => {
      if (wasConnectedRef.current) {
        setShowOffline(true);
        setShowOnline(false);
      }
      wasConnectedRef.current = false;
      checkConnectionInterval.stop();
    };

    socket.socket.on("connect", onConnect);
    socket.socket.on("disconnect", onDisconnect);

    // Initial state check
    if (!socket.socket.connected && wasConnectedRef.current) {
      setShowOffline(true);
      setShowOnline(false);
      wasConnectedRef.current = false;
    }

    return () => {
      socket?.socket?.off("connect", onConnect);
      socket?.socket?.off("disconnect", onDisconnect);
      checkConnectionInterval.stop();
    };
  }, [socket?.socket]);

  const handleOfflineClose = () => {
    setShowOffline(false);
    userDismissedRef.current = true;
    // Only start checking if we're still disconnected
    if (!socket?.socket?.connected) {
      checkConnectionInterval.start();
    }
  };

  return (
    <>
      {showOffline && (
        <Notification
          icon={<IconX size={20} />}
          color="red"
          title="Connection lost"
          onClose={handleOfflineClose}
          withCloseButton
          styles={{
            root: {
              position: "fixed",
              bottom: 20,
              left: 20,
              zIndex: 1000,
              backgroundColor: "#ff6b6b",
              color: "white",
              borderLeft: "4px solid #ff0000",
            },
            title: {
              color: "white",
              fontWeight: 600,
            },
            closeButton: {
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            },
          }}
        >
          <span style={{ color: "white" }}>
            The server connection has been lost. Trying to reconnect...
          </span>
        </Notification>
      )}

      {showOnline && (
        <Notification
          icon={<IconCheck size={20} />}
          color="teal"
          title="Back online"
          withCloseButton={false}
          styles={{
            root: {
              position: "fixed",
              bottom: 20,
              left: 20,
              zIndex: 1000,
              backgroundColor: "#38a169",
              color: "white",
              borderLeft: "4px solid #2c7a5b",
            },
            title: {
              color: "white",
              fontWeight: 600,
            },
          }}
        >
          <span style={{ color: "white" }}>You are now back online</span>
        </Notification>
      )}
    </>
  );
}

export default SocketConnectionNotifier;
