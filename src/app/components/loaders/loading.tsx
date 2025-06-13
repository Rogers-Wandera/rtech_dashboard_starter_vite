import { Loader, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useMantineColorScheme } from "@mantine/core";
import { Box } from "@mantine/core";
import MotionProgressBar from "@/components/shared/motionprogress";

interface ProfessionalLoaderProps {
  visible: boolean;
  progress?: boolean;
  message?: string;
  loaderVariant?: "bars" | "oval" | "dots";
  loaderColor?: string;
  progressInterval?: number;
  progressDuration?: number;
  onProgressComplete?: () => void;
  showPercentage?: boolean;
}

const CustomLoader = ({
  visible,
  progress,
  message,
  loaderVariant = "oval",
  loaderColor = "teal",
  progressInterval = 25,
  progressDuration = 3000,
  onProgressComplete,
  showPercentage = true,
}: ProfessionalLoaderProps) => {
  const { colorScheme } = useMantineColorScheme();

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backgroundColor:
          colorScheme === "dark"
            ? "rgba(0, 0, 0, 0.85)"
            : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          width: 300,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader size="xl" variant={loaderVariant} color={loaderColor} />
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Text
              size="lg"
              fw={500}
              c={colorScheme === "dark" ? "white" : "dark"}
              ta="center"
            >
              {message}
            </Text>
          </motion.div>
        )}

        {progress && (
          <MotionProgressBar
            interval={progressInterval}
            duration={progressDuration}
            color={loaderColor}
            onComplete={onProgressComplete}
            showPercentage={showPercentage}
          />
        )}
      </motion.div>
    </Box>
  );
};

export default CustomLoader;
