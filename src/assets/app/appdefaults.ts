import { Notifications } from "@/types/server/server.main.types";

export const countryCodes = [
  { value: "+256", label: "+256" },
  { value: "+254", label: "+254" },
  { value: "+255", label: "+255" },
];

export const UserNotifications: Notifications = [
  {
    category: "All",
    count: 0,
    items: [],
  },
  {
    category: "Unread",
    count: 0,
    items: [],
  },
  {
    category: "Urgent",
    count: 0,
    items: [],
  },
  {
    category: "Announcements",
    count: 0,
    items: [],
  },
  {
    category: "System",
    count: 0,
    items: [],
  },
  {
    category: "Read",
    count: 0,
    items: [],
  },
];
