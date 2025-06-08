import { NotificationTypeCombined } from "@/lib/context/notifications/notification";
import { Badge, Box, Center, Group, Text } from "@mantine/core";
import { AnimatePresence } from "framer-motion";
import NotificationItem from "./components/item";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "@mantine/core";
import { NotificationResponse } from "@/types/server/server.main.types";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import AutoSizer from "react-virtualized-auto-sizer";

import { VariableSizeList } from "react-window";

type Filtered =
  | {
      type: "user";
      data: NotificationResponse<NotificationRecipient> | undefined;
    }
  | {
      type: "main";
      data: NotificationResponse<NotificationEntity> | undefined;
    };

interface NotificationContentProps {
  classes: Record<string, any>;
  activeFilter: NotificationTypeCombined;
  getCount: number;
  filtered: Filtered;
  handleOpenDetails: (
    notification: NotificationRecipient | NotificationEntity
  ) => void;
  cx: (...args: any) => string;
}

type ItemProps = {
  item: NotificationRecipient | NotificationEntity;
  classes: Record<string, any>;
  cx: (...args: any) => string;
  handleOpenDetails: (
    notification: NotificationRecipient | NotificationEntity
  ) => void;
  setHeight?: (height: number) => void;
};

function isRecipient(
  item: NotificationRecipient | NotificationEntity
): item is NotificationRecipient {
  return "readStatus" in item;
}

const MemoizedNotificationItem = memo(
  ({ item, classes, cx, handleOpenDetails, setHeight }: ItemProps) => (
    <div onClick={() => handleOpenDetails(item)}>
      <NotificationItem
        item={item}
        classes={classes}
        cx={cx}
        setHeight={setHeight}
      />
    </div>
  ),
  (prev, next) => {
    if (prev.item.id !== next.item.id) return false;
    if (isRecipient(prev.item) && isRecipient(next.item)) {
      return prev.item.readStatus === next.item.readStatus;
    }
    return true;
  }
);

export const NotificationContent = ({
  classes,
  activeFilter,
  getCount,
  filtered,
  handleOpenDetails,
  cx,
}: NotificationContentProps) => {
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const rowHeights = useRef<Record<number, number>>({});

  const paginatedItems = useMemo(() => {
    return (
      filtered?.data?.items?.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
      ) || []
    );
  }, [filtered?.data?.items, activePage, itemsPerPage]);

  const GAP = 10;

  const getRowHeight = (index: number) => {
    return (rowHeights.current[index] || 120) + GAP;
  };

  const setRowHeight = (index: number, height: number) => {
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: height };
  };

  // Scroll to top when page changes
  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
    listRef.current?.scrollTo(0);
  }, [activePage]);

  if (!filtered?.data) {
    return (
      <Center className={classes.mainContent} style={{ height: "50vh" }}>
        <Text size="lg" c="dimmed">
          No notifications available
        </Text>
      </Center>
    );
  }

  return (
    <div className={classes.mainContent} ref={containerRef}>
      <Box className={classes.header}>
        <Group justify="apart">
          <Text size="xl" fw={700}>
            {activeFilter === NotificationTypeCombined.ALL
              ? "All Notifications"
              : `${
                  activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)
                } Notifications`}
          </Text>
          <Badge
            variant="filled"
            size="lg"
            color={getCount > 0 ? "blue" : "gray"}
          >
            Showing {Math.min(itemsPerPage, paginatedItems.length)} of{" "}
            {getCount}
          </Badge>
        </Group>
      </Box>

      <Box mt="md">
        <AnimatePresence>
          {filtered?.data && (
            <>
              {paginatedItems.length > 0 ? (
                <>
                  <div style={{ height: "100%", minHeight: "560px" }}>
                    <AutoSizer>
                      {({ height, width }) => (
                        <VariableSizeList
                          height={height}
                          itemCount={paginatedItems.length}
                          itemSize={getRowHeight}
                          width={width}
                          ref={listRef}
                        >
                          {({ index, style }) => (
                            <div
                              style={{
                                ...style,
                                top: `${
                                  parseFloat(style.top as string) + GAP
                                }px`,
                                height: `${
                                  parseFloat(style.height as string) - GAP
                                }px`,
                              }}
                            >
                              <MemoizedNotificationItem
                                item={paginatedItems[index]}
                                classes={classes}
                                cx={cx}
                                handleOpenDetails={handleOpenDetails}
                                setHeight={(height: number) =>
                                  setRowHeight(index, height)
                                }
                              />
                            </div>
                          )}
                        </VariableSizeList>
                      )}
                    </AutoSizer>
                  </div>
                  {/* Pagination Controls */}
                  <Center>
                    <Pagination
                      total={Math.ceil(
                        filtered.data.items.length / itemsPerPage
                      )}
                      value={activePage}
                      onChange={setActivePage}
                      mt="md"
                      withEdges
                      siblings={1}
                      boundaries={1}
                    />
                  </Center>
                </>
              ) : (
                <Box className={classes.emptyState}>
                  <Text size="lg" mb="sm">
                    No notifications found
                  </Text>
                  <Text c="dimmed">
                    {activeFilter === NotificationTypeCombined.ALL
                      ? "You don't have any notifications yet."
                      : `You don't have any ${activeFilter} notifications.`}
                  </Text>
                </Box>
              )}
            </>
          )}
        </AnimatePresence>
      </Box>
    </div>
  );
};
