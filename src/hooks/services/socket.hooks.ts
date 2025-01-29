import { useSocket } from "@/lib/context/services/socket";
import { useCallback, useEffect } from "react";

export const useSocketEvent = (
  eventName: string,
  callback: (data: any) => void
) => {
  const state = useSocket();

  useEffect(() => {
    if (!state?.socket) return;
    state.socket.on(eventName, callback);

    return () => {
      state.socket?.off(eventName, callback);
    };
  }, [state?.socket, eventName, callback]);
};

export const useSocketEmit = (eventName: string) => {
  const state = useSocket();
  const emit = useCallback(
    <T = unknown>(data: T) => {
      if (state?.socket) {
        console.log(`Emitting event: ${eventName} with data:`, data);
        state.socket.emit(eventName, data);
      } else {
        console.error("Socket is not connected. Cannot emit event.");
      }
    },
    [state?.socket, eventName]
  );
  return emit;
};
