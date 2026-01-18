import { Box, lighten } from "@mui/material";
import type { ReactNode } from "react";

interface BoxWrapperProps {
  children: ReactNode;
}

const BoxWrapper = ({ children }: BoxWrapperProps) => {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: 5,
        bgcolor: theme.palette.background.paper,
        p: { xs: 2, sm: 3 },
        border: `2px solid ${lighten(theme.palette.background.paper, 0.1)}`,
      })}
    >
      {children}
    </Box>
  );
};

export default BoxWrapper;
