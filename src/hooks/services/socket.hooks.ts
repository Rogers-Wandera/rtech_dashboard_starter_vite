import { useSocket } from "@/lib/context/services/socket";
import { useCallback, useEffect, useRef } from "react";

interface SocketEventOptions {
  enabled?: boolean;
  namespace?: string;
  onError?: (error: Error) => void;
}

export const useSocketEvent = <T = any>(
  eventName: string,
  callback: (data: T) => void,
  options: SocketEventOptions = {}
) => {
  const { enabled = true, namespace, onError } = options;
  const state = useSocket(namespace);
  const callbackRef = useRef(callback);

  // Keep callback reference up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !state?.socket) return;

    const eventHandler = (data: T) => {
      try {
        callbackRef.current(data);
      } catch (error) {
        console.error(`Error in socket event handler for ${eventName}:`, error);
        onError?.(error as Error);
      }
    };

    state.socket.on(eventName, eventHandler);

    return () => {
      state.socket?.off(eventName, eventHandler);
    };
  }, [state?.socket, eventName, enabled, namespace, onError]);
};

interface EmitOptions {
  namespace?: string;
  acknowledge?: boolean;
  timeout?: number;
  acknowledgeCallback?: (response: any) => void;
}

export const useSocketEmit = <T = unknown>(
  eventName: string,
  options: EmitOptions = {}
) => {
  const { namespace, acknowledge = false, timeout = 5000 } = options;
  const state = useSocket(namespace);

  const emit = useCallback(
    (data: T) => {
      if (!state?.socket?.connected || !state.socket) {
        console.error(`Socket not connected. Cannot emit ${eventName}`);
        return acknowledge
          ? Promise.reject(new Error("Socket not connected"))
          : undefined;
      }

      if (acknowledge) {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(`Emit timeout for event ${eventName}`));
          }, timeout);

          state.socket?.emit(eventName, data, (response: any) => {
            clearTimeout(timer);
            if (response?.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
              if (options.acknowledgeCallback) {
                options.acknowledgeCallback(response);
              }
            }
          });
        });
      }

      state.socket?.emit(eventName, data);
      return undefined;
    },
    [state?.socket, eventName, acknowledge, timeout]
  );

  return emit;
};

export const useSocketConnectionState = (
  options: { namespace?: string } = {}
) => {
  const { namespace } = options;
  const state = useSocket(namespace);

  return {
    isConnected: state?.isConnected || false,
    isReconnecting: state?.isReconnecting || false,
    error: state?.error || null,
    retryCount: state?.retryCount || 0,
  };
};
