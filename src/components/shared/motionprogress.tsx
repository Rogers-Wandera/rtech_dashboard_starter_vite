import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMantineColorScheme } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Text } from "@mantine/core";

const MotionProgressBar = ({
  interval,
  duration,
  color,
  onComplete,
  showPercentage,
}: {
  interval: number;
  duration: number;
  color: string;
  onComplete?: () => void;
  showPercentage: boolean;
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate increment based on duration and interval
  const totalSteps = duration / interval;
  const baseIncrement = 1 / totalSteps;

  const { start, stop } = useInterval(() => {
    if (isComplete) return;

    setProgress((prev) => {
      // Easing function for progress - starts fast, slows down at the end
      const easedProgress =
        prev < 0.7
          ? prev + baseIncrement * 1.5
          : prev < 0.9
          ? prev + baseIncrement
          : prev + baseIncrement * 0.5;

      const newValue = Math.min(easedProgress, 1);

      if (newValue >= 1) {
        setIsComplete(true);
        stop();
        if (onComplete) onComplete();
      }

      return newValue;
    });
  }, interval);

  // Start and clean up interval
  useEffect(() => {
    start();
    return () => stop();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        style={{
          height: 8,
          backgroundColor:
            colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[3],
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{
            duration: interval / 1000,
            ease: "easeOut",
          }}
          style={{
            height: "100%",
            backgroundColor: theme.colors[color][6],
            borderRadius: 4,
            boxShadow: `${theme.colors[color][4]} 0px 2px 8px`,
          }}
        />
      </motion.div>

      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Text
            size="sm"
            c={
              colorScheme === "dark"
                ? theme.colors.gray[4]
                : theme.colors.gray[7]
            }
            fw={600}
          >
            {Math.round(progress * 100)}%
          </Text>
        </motion.div>
      )}
    </div>
  );
};

export default MotionProgressBar;
