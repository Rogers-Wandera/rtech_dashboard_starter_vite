import { useMemo } from "react";
import { createTheme } from "@mantine/core";

export const MantineTheme = () => {
  const theme = useMemo(() => {
    return createTheme({
      colors: {
        dark: [
          "#d5d7e0",
          "#acaebf",
          "#8c8fa3",
          "#666980",
          "#4d4f66",
          "#34354a",
          "#2b2c3d",
          "#1d1e30",
          "#0c0d21",
          "#01010a",
          "#222738",
        ],
      },
    });
  }, []);
  return theme;
};
