import {
  NotificationTypeCombined,
  useNotification,
} from "@/lib/context/notifications/notification";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import {
  MainNotifications,
  NotificationResponse,
  Notifications,
} from "@/types/server/server.main.types";
import { Button, Loader } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Box } from "@mantine/core";
import { Menu, ScrollArea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconAlertTriangle,
  IconBell,
  IconCalendar,
  IconClock,
  IconFilter,
  IconMail,
  IconMessage,
  IconMicrophone2,
  IconSearch,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

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

interface MobileNotificationMenuProps {
  classes: Record<string, any>;
  activeFilter: NotificationTypeCombined;
  setActiveFilter: (filter: NotificationTypeCombined) => void;
  setFiltered: (filtered: Filtered) => void;
  userCats: Category[];
  mainCats: Category[];
  userNotifications: Notifications;
  mainNotifications: MainNotifications;
  isAuthorized: boolean;
  cx: (...args: any) => string;
}

export const MobileNotificationMenu = ({
  classes,
  activeFilter,
  setActiveFilter,
  setFiltered,
  userCats,
  mainCats,
  userNotifications,
  mainNotifications,
  isAuthorized,
  cx,
}: MobileNotificationMenuProps) => {
  const { searchQuery, setDateRange, setSearchQuery, dateRange, isLoading } =
    useNotification();

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const getIcon = (category: string) => {
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
      default:
        return <IconBell size={18} />;
    }
  };

  const handleFilterClick = (category: string, type: "user" | "main") => {
    setActiveFilter(category as NotificationTypeCombined);
    const itemData = type === "user" ? userNotifications : mainNotifications;
    setFiltered({
      type,
      data: itemData.find((item) => item.category === category),
    } as Filtered);
  };

  return (
    <Menu
      shadow="md"
      width={300}
      closeOnClickOutside={!datePickerOpen}
      closeOnItemClick={!datePickerOpen}
      opened={datePickerOpen ? true : undefined}
    >
      <Menu.Target>
        <Button leftSection={<IconFilter size={16} />} fullWidth mb="md">
          Filter Notifications
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Box p="sm">
          <TextInput
            placeholder="Search notifications..."
            leftSection={<IconSearch size={16} />}
            mb="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            rightSection={isLoading ? <Loader size={20} /> : null}
          />

          {/* Date Range Filter */}
          <DatePickerInput
            type="range"
            placeholder="Filter by date range"
            leftSection={<IconCalendar size={16} />}
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates);
            }}
            popoverProps={{
              onOpen: () => setDatePickerOpen(true),
            }}
            onDropdownClose={() => setDatePickerOpen(false)}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>

        <Menu.Divider />

        <Menu.Label>Your Notifications</Menu.Label>
        <ScrollArea.Autosize mah={400}>
          {userCats?.map((category) => (
            <Menu.Item
              key={`user-${category.category}`}
              leftSection={getIcon(category.category)}
              onClick={() => handleFilterClick(category.category, "user")}
              className={cx(
                activeFilter === category.category && classes.activeFilterItem
              )}
            >
              <div className={classes.mobileFilterItem}>
                <span>{category.category}</span>
                <span className={classes.mobileFilterCount}>
                  {category.count}
                </span>
              </div>
            </Menu.Item>
          ))}

          {isAuthorized && (
            <>
              <Menu.Divider />
              <Menu.Label>Admin Notifications</Menu.Label>
              {mainCats?.map((category) => (
                <Menu.Item
                  key={`main-${category.category}`}
                  leftSection={getIcon(category.category)}
                  onClick={() => handleFilterClick(category.category, "main")}
                  className={cx(
                    activeFilter === category.category &&
                      classes.activeFilterItem
                  )}
                >
                  <div className={classes.mobileFilterItem}>
                    <span>{category.category}</span>
                    <span className={classes.mobileFilterCount}>
                      {category.count}
                    </span>
                  </div>
                </Menu.Item>
              ))}
            </>
          )}
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  );
};
