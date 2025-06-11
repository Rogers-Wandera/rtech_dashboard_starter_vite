import RingingBellWithBadge from "@/components/shared/ringingbell";
import { useAppDispatch } from "@/hooks/store.hooks";
import {
  useNotification,
  useNotificationType,
} from "@/lib/context/notifications/notification";
import { setShouldNotificationRing } from "@/lib/store/services/defaults/defaults";
import { RootState } from "@/lib/store/store";
import {
  Group,
  Text,
  Badge,
  Menu,
  Button,
  Box,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBellFilled, IconX } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { VariableSizeList } from "react-window";
import NotificationDropDownItem from "./components/itemmenu";

dayjs.extend(relativeTime);

const NotificationDropdown = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isOpened = useSelector(
    (state: RootState) => state.appState.defaultstate.shouldNotificationRing
  );

  const listRef = useRef<VariableSizeList>(null);
  const rowHeights = useRef<Record<number, number>>({});

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { setRefetch } = useNotification();

  const notification = useNotificationType({
    type: "user",
    category: "UNREAD",
  });

  const unreadCount = notification?.count || 0;

  const HandleOpen = () => {
    dispatch(setShouldNotificationRing(false));
    toggle();
  };

  const getItemSize = (index: number) => {
    return rowHeights.current[index] || 120;
  };

  const setRowHeight = (index: number, height: number) => {
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: height };
  };

  useEffect(() => {
    setRefetch(true);
  }, []);

  return (
    <Menu
      width={360}
      transitionProps={{ transition: "rotate-left" }}
      onClose={close}
      onOpen={HandleOpen}
      zIndex={9999}
      opened={opened}
      withArrow
      closeOnItemClick={false}
    >
      <Menu.Target>
        <Box sx={{ position: "relative" }}>
          {unreadCount <= 0 && (
            <IconBellFilled size={27} style={{ cursor: "pointer" }} />
          )}
          {unreadCount > 0 && (
            <RingingBellWithBadge count={unreadCount} shouldRing={isOpened} />
          )}
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between">
            <Group gap={4}>
              <Text size="sm" fw={600}>
                Notifications
              </Text>
              <Badge variant="light" color="blue" size="sm">
                {unreadCount > 0 &&
                  `${unreadCount >= 100 ? "99+" : unreadCount} new`}
                {unreadCount <= 0 && "No new notifications"}
              </Badge>
            </Group>
            <ActionIcon onClick={close}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Menu.Label>

        {notification && notification?.items?.length > 0 && (
          <div style={{ height: 300, width: "100%" }}>
            <VariableSizeList
              ref={listRef}
              height={300}
              itemCount={notification.items.length}
              itemSize={getItemSize}
              width="100%"
              overscanCount={3}
            >
              {({ index, style }) => (
                <div style={style}>
                  <NotificationDropDownItem
                    notification={notification.items[index]}
                    setHeight={(height) => setRowHeight(index, height)}
                  />
                </div>
              )}
            </VariableSizeList>
          </div>
        )}

        {(!notification || notification?.items?.length === 0) && (
          <Box p="md" sx={{ textAlign: "center" }}>
            <Text size="sm" c="dimmed">
              No notifications yet
            </Text>
          </Box>
        )}

        <Menu.Divider />

        <Box px="sm" pb="sm">
          <Button
            fullWidth
            variant="light"
            disabled={!notification || notification?.items?.length === 0}
            onClick={() => navigate("/dashboard/core/notifications")}
          >
            See all incoming activity
          </Button>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationDropdown;

NotificationDropdown.displayName = "NotificationDropdown";
