import { Badge, Box, Card, Group, Text } from "@mantine/core";

const NotificationFilterCard = ({
  icon,
  label,
  count,
  active,
  onClick,
  cx,
  classes,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  cx: (...args: any) => string;
  classes: Record<string, any>;
}) => {
  return (
    <Card
      withBorder
      p="sm"
      mb="sm"
      className={cx(classes.filterCard, { [classes.activeFilter]: active })}
      onClick={onClick}
    >
      <Group>
        <Box className={classes.filterIcon}>{icon}</Box>
        <Text fw={500}>{label}</Text>
        <Badge ml="auto" variant="light" color={active ? "blue" : "gray"}>
          {count}
        </Badge>
      </Group>
    </Card>
  );
};

export default NotificationFilterCard;
