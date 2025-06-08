import { Card, Text, Divider } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBell,
  IconCalendar,
  IconClock,
  IconMail,
  IconMessage,
  IconMicrophone2,
  IconPlus,
  IconSearch,
  IconSend,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import {
  NotificationTypeCombined,
  useNotification,
} from "@/lib/context/notifications/notification";
import { Button } from "@mantine/core";
import NotificationFilterCard from "./components/filtercard";
import { TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  MainNotifications,
  NotificationResponse,
  Notifications,
} from "@/types/server/server.main.types";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";

import AutoSizer from "react-virtualized-auto-sizer";

import { VariableSizeList } from "react-window";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";

interface NotificationSidebarProps {
  classes: Record<string, any>;
  cx: (...args: any) => string;
  activeFilter: NotificationTypeCombined;
  setActiveFilter: (filter: NotificationTypeCombined) => void;
  setFiltered: (filtered: Filtered) => void;
  userCats: Category[];
  mainCats: Category[];
  userNotifications: Notifications;
  mainNotifications: MainNotifications;
  isAuthorized: boolean;
  openCreateModal: () => void;
}

type Category = {
  category: string;
  count: number;
};

type Filtered =
  | {
      type: "user";
      data: NotificationResponse<NotificationRecipient> | undefined;
    }
  | {
      type: "main";
      data: NotificationResponse<NotificationEntity> | undefined;
    };

const getIcon = (category: NotificationTypeCombined) => {
  switch (category) {
    case "System":
      return <IconSettings size={18} />;
    case "Unread":
      return <IconMail size={18} />;
    case "Urgent":
      return <IconAlertTriangle size={18} />;
    case "Read":
      return <IconMessage size={18} />;
    case "Announcements":
      return <IconMicrophone2 size={18} />;
    case "Failed":
      return <IconX size={18} />;
    case "Scheduled":
      return <IconClock size={18} />;
    case "Expired":
      return <IconAlertTriangle size={18} />;
    case "Sent":
      return <IconSend size={18} />;
    default:
      return <IconBell size={18} />;
  }
};

const MemoizedNotificationFilterCard = memo(
  NotificationFilterCard,
  (prev, next) => {
    return (
      prev.label === next.label &&
      prev.count === next.count &&
      prev.active === next.active &&
      prev.classes === next.classes
    );
  }
);

export const NotificationSidebar = ({
  classes,
  cx,
  activeFilter,
  setActiveFilter,
  setFiltered,
  userNotifications,
  mainNotifications,
  isAuthorized,
  openCreateModal,
}: NotificationSidebarProps) => {
  const {
    searchQuery,
    setDateRange,
    setSearchQuery,
    dateRange,
    userCategories,
    mainCategories,
  } = useNotification();

  const listRef = useRef<VariableSizeList>(null);
  const rowHeights = useRef<Record<number, number>>({});

  const handleFilterClick = useCallback(
    (category: string, type: "user" | "main") => {
      setActiveFilter(category as NotificationTypeCombined);
      const data = type === "user" ? userNotifications : mainNotifications;
      setFiltered({
        type,
        data: data.find((item) => item.category === category),
      } as Filtered);
    },
    [userNotifications, mainNotifications, setActiveFilter, setFiltered]
  );

  const GAP = 8;
  const combined: (Category & { text?: string; type: string })[] =
    useMemo(() => {
      const maincats =
        isAuthorized && mainCategories?.length > 0
          ? [
              {
                category: "divider",
                count: 0,
                text: "ADMIN NOTIFICATIONS",
                type: "main",
              },
              ...mainCategories.map((item) => ({ ...item, type: "main" })),
            ]
          : [];

      return [
        {
          category: "divider",
          count: 0,
          text: "YOUR NOTIFICATIONS",
          type: "user",
        },
        ...userCategories.map((item) => ({ ...item, type: "user" })),
        ...maincats,
      ];
    }, [userCategories, mainCategories, isAuthorized]);

  const getRowHeight = useCallback(
    (index: number) => {
      const item = combined[index];
      return item.category === "divider"
        ? item.text
          ? 50
          : 20
        : (rowHeights.current[index] || 50) + GAP;
    },
    [combined]
  );

  const setRowHeight = useCallback((index: number, height: number) => {
    if (!rowHeights.current[index] || rowHeights.current[index] !== height) {
      rowHeights.current = { ...rowHeights.current, [index]: height };
      listRef.current?.resetAfterIndex(index);
    }
  }, []);

  const iconCache = useMemo(() => {
    const cache = new Map<NotificationTypeCombined, React.ReactNode>();
    // Pre-cache all icons
    Object.values(NotificationTypeCombined).forEach((category) => {
      cache.set(category, getIcon(category));
    });
    return cache;
  }, []);

  useEffect(() => {
    const handleResize = debounce(() => {
      listRef.current?.resetAfterIndex(0);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={classes.sidebar}>
      <Button
        fullWidth
        leftSection={<IconPlus size={16} />}
        className={classes.createButton}
        onClick={openCreateModal}
        disabled={true}
      >
        Create Notification
      </Button>

      <Card
        withBorder
        p="md"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "calc(100% - 50px)",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <TextInput
            placeholder="Search notifications..."
            leftSection={<IconSearch size={16} />}
            mb="md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />

          <DatePickerInput
            type="range"
            placeholder="Filter by date range"
            leftSection={<IconCalendar size={16} />}
            mb="md"
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: "300px",
          }}
        >
          <AutoSizer>
            {({ height, width }) => (
              <VariableSizeList
                height={height}
                itemCount={combined.length}
                itemSize={getRowHeight}
                width={width}
                ref={listRef}
                overscanCount={5}
              >
                {({ index, style }) => {
                  const item = combined[index];
                  return (
                    <div
                      style={{
                        ...style,
                        top: `${parseFloat(style.top as string) + GAP}px`,
                        height:
                          item.category === "divider"
                            ? undefined
                            : `${parseFloat(style.height as string) - GAP}px`,
                      }}
                    >
                      {item.category === "divider" ? (
                        <>
                          {item.text && (
                            <>
                              <Divider my="sm" />
                              <Text fw={500} c="dimmed" size="sm">
                                {item.text}
                              </Text>
                            </>
                          )}
                        </>
                      ) : (
                        <MemoizedNotificationFilterCard
                          icon={iconCache.get(
                            item.category as NotificationTypeCombined
                          )}
                          label={item.category}
                          count={item.count}
                          active={activeFilter === item.category}
                          onClick={() =>
                            handleFilterClick(
                              item.category,
                              item.type as "user" | "main"
                            )
                          }
                          classes={classes}
                          cx={cx}
                          setHeight={(height: number) =>
                            setRowHeight(index, height)
                          }
                        />
                      )}
                    </div>
                  );
                }}
              </VariableSizeList>
            )}
          </AutoSizer>
        </div>
      </Card>
    </div>
  );
};
