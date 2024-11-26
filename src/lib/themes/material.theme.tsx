import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useMemo } from "react";
import { createTheme } from "@mui/material";

export const useMaterialTheme = () => {
  const settings = useSelector((state: RootState) => state.setting.setting);
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: settings.theme_scheme.value === "dark" ? "dark" : "light",
        background: {
          default:
            settings.theme_scheme.value === "light" ? "#ffffff" : "#222738",
        },
      },
    });
  }, [settings]);
  return theme;
};
