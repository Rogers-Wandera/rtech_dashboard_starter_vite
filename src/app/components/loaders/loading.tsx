import { motion } from "framer-motion";
import "./loader.css";

const CustomLoader = ({
  color = "tw:text-blue-600",
  text = "Loading your dashboard...",
  fullScreen = true,
}: {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}) => {
  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className={`tw:relative tw:flex tw:flex-col tw:items-center tw:justify-center ${
        fullScreen
          ? "tw:fixed tw:inset-0 tw:h-screen tw:w-screen tw:z-[9999]"
          : "tw:h-full tw:w-full"
      }`}
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
    >
      {/* Animated background */}
      <motion.div
        className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-50"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      {/* Main loader content */}
      <div className="tw:relative tw:z-10 tw:flex tw:flex-col tw:items-center">
        {/* Bubble animation container */}
        <div className="tw:relative tw:mb-8 tw:h-40 tw:w-40">
          <div className="Strich1">
            <div className="Strich2">
              <div className="bubble"></div>
              <div className="bubble1"></div>
              <div className="bubble2"></div>
              <div className="bubble3"></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        {text && (
          <motion.p
            className={`tw:mt-4 ${color} tw:font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {text}
          </motion.p>
        )}
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="tw:absolute tw:left-1/4 tw:top-1/3 tw:w-8 tw:h-8 tw:rounded-full tw:bg-blue-200 tw:opacity-40"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="tw:absolute tw:right-1/4 tw:bottom-1/3 tw:w-6 tw:h-6 tw:rounded-full tw:bg-indigo-200 tw:opacity-40"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </motion.div>
  );
};

export default CustomLoader;
