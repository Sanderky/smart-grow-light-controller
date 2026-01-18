import { Box, Stack } from "@mui/material";
import ManualControl from "./components/ManualControl";
import Info from "./components/Info";
import Schedule from "./components/Schedule";

function App() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'background.default',
      px: {xs: 1, sm: 4},
      py: {xs: 2, sm: 4},
      minHeight: '100vh'
    }}>

      <Stack
        spacing={2}
        sx={{
          maxWidth: '1000px',
          flex: 1
        }}
      >
        <Info />
        <ManualControl />
        <Schedule/>
      </Stack>
    </Box>
  );
}

export default App;
