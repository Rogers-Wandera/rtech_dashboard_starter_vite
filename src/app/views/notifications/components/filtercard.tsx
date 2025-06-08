import { Badge, Box, Card, Group, Text } from "@mantine/core";
import { useEffect, useRef } from "react";

const NotificationFilterCard = ({
  icon,
  label,
  count,
  active,
  onClick,
  cx,
  classes,
  setHeight,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  cx: (...args: any) => string;
  classes: Record<string, any>;
  setHeight?: (height: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && setHeight) {
      setHeight(ref.current.clientHeight);
    }
  }, [setHeight]);

  return (
    <Card
      ref={ref}
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
