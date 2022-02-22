import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { useThemeMode } from "../useTheme";

export const ModeButton: React.FC<ButtonProps> = (props) => {
  const theme = useThemeMode();
  const { children } = props;
  return (
    <Button {...props} variant={theme.mode === "dark" ? "light" : "dark"}>
      {children}
    </Button>
  );
};
