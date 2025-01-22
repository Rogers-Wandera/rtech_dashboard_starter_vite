import { useSocket } from "@/lib/context/services/socket";
import { EVENT_NAMES } from "@/types/enums/event.enums";
import { useCallback, useEffect } from "react";

export const useSocketEvent = (
  eventName: keyof typeof EVENT_NAMES,
  callback: (data: any) => void
) => {
  const state = useSocket();

  useEffect(() => {
    if (!state?.socket) return;

    const event = EVENT_NAMES[eventName];
    state.socket.on(event, callback);

    return () => {
      state.socket?.off(event, callback);
    };
  }, [state?.socket, eventName, callback]);
};

export const useSocketEmit = (eventName: keyof typeof EVENT_NAMES) => {
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
