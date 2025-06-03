import { motion } from "framer-motion";
import { IconBellFilled } from "@tabler/icons-react";
import { Badge } from "@mui/material";

const RingingBellWithBadge = ({ count = 1 }) => {
  return (
    <div className="relative w-fit" style={{ cursor: "pointer" }}>
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      >
        <Badge color="secondary" badgeContent={count} max={100}>
          <IconBellFilled size={32} />
        </Badge>
      </motion.div>
    </div>
  );
};

export default RingingBellWithBadge;
