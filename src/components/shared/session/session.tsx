import { Badge, Button, Progress, Text, Tooltip } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { USER_EVENTS } from "@/types/enums/event.enums";
import { useSocketEmit } from "@/hooks/services/socket.hooks";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { notifier } from "@/lib/utils/notify/notification";
import {
  logOut,
  setToken,
  setUser,
} from "@/lib/store/services/auth/auth.slice";
import { stopTimer } from "@/lib/store/services/auth/session.slice";
import { setSession } from "@/lib/store/services/defaults/defaults";
import { jwtDecode } from "jwt-decode";
import { TypeToken } from "@/types/app/auth/auth.types";

interface SessionTimerProps {
  warningThreshold?: number;
}

export function SessionTimer({ warningThreshold = 120 }: SessionTimerProps) {
  const { secondsLeft, isActive } = useSelector(
    (state: RootState) => state.appState.sessiontimer
  );

  const { user, sessionId } = useAuth();
  const dispatch = useAppDispatch();
  const emit = useSocketEmit(USER_EVENTS.LOGOUT, { namespace: "user" });

  const HandleSessionUpdate = (data: { token: string; message?: string }) => {
    dispatch(setToken(data.token));
    const decodeToken = jwtDecode<TypeToken>(data.token);
    dispatch(setUser(decodeToken.user));
    dispatch(setSession(false));
    dispatch(stopTimer());
    if (data?.message) {
      notifier.success({ message: data.message });
    }
  };
  const updateSession = useSocketEmit(USER_EVENTS.UPDATE_SESSION, {
    namespace: "user",
    acknowledge: true,
    acknowledgeCallback: HandleSessionUpdate,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getButtonColor = () => {
    if (secondsLeft <= 60) return "red";
    if (secondsLeft <= warningThreshold) return "orange";
    return "blue";
  };

  const HandleExtendSession = async () => {
    await updateSession({
      userId: user?.id,
      sessionId,
    });
    notifier.info({
      message: "Your request is being processed, please wait ... ",
    });
  };

  const HandleLogOut = async () => {
    await emit({ userId: user?.id, sessionId });
    dispatch(logOut());
    dispatch(stopTimer());
    dispatch(setSession(false));
    notifier.success({ message: "Logout Successful" });
  };

  if (!isActive || secondsLeft <= 0) return null;

  const openModal = () =>
    modals.openConfirmModal({
      title: "Session About to Expire",
      centered: true,
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Your session will expire in{" "}
            <Badge color={getButtonColor()} variant="filled">
              {formatTime(secondsLeft)}
            </Badge>
            . Do you want to stay logged in?
          </Text>

          <Progress
            value={(secondsLeft / (warningThreshold + 60)) * 100} // Adjust denominator as needed
            size="md"
            color={getButtonColor()}
            animated={secondsLeft <= warningThreshold}
            transitionDuration={200}
          />
        </div>
      ),
      labels: { confirm: "Logout Now", cancel: " Stay Logged In" },
      confirmProps: { color: "gray", variant: "outline" },
      cancelProps: { color: getButtonColor() },
      onCancel: HandleExtendSession,
      onConfirm: HandleLogOut,
      closeOnClickOutside: false,
      closeOnEscape: false,
    });
  return (
    <>
      <div className="tw:fixed tw:top-30 tw:right-6 tw:z-1000">
        <Tooltip
          label={
            secondsLeft <= 30
              ? "Session expiring soon!"
              : "Click to extend session"
          }
          withArrow
          color={getButtonColor()}
        >
          <Button
            leftSection={<IconClock size={18} />}
            variant={secondsLeft <= 30 ? "filled" : "gradient"}
            color={getButtonColor()}
            className={`tw-shadow-lg ${
              secondsLeft <= 30 ? "tw-animate-pulse" : ""
            }`}
            onClick={openModal}
            // radius="xl"
            size="sm"
          >
            {formatTime(secondsLeft)}
            {secondsLeft <= 0 && (
              <span className="tw-ml-2 tw-animate-ping tw-absolute tw-inline-flex tw-h-3 tw-w-3 tw-rounded-full tw-bg-red-500 tw-opacity-75"></span>
            )}
          </Button>
        </Tooltip>
      </div>
    </>
  );
}
