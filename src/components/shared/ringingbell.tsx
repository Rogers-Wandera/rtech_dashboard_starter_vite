import { motion } from "framer-motion";
import { IconBellFilled, IconProps } from "@tabler/icons-react";
import { Badge } from "@mui/material";

type Props = {
  count?: number;
  shouldRing?: boolean;
  iconProps?: IconProps;
};
const RingingBellWithBadge = ({
  count = 1,
  shouldRing = true,
  iconProps = {},
}: Props) => {
  return (
    <div className="relative w-fit" style={{ cursor: "pointer" }}>
      <motion.div
        animate={
          shouldRing ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }
        }
        transition={
          shouldRing
            ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
            : { repeat: 0, duration: 0, ease: "easeInOut" }
        }
      >
        <Badge color="secondary" badgeContent={count} max={100}>
          <IconBellFilled size={32} {...iconProps} />
        </Badge>
      </motion.div>
    </div>
  );
};

export default RingingBellWithBadge;
