import { Stack } from "@mui/material";
import ManualControl from "./components/ManualControl";
import Info from "./components/Info";

function App() {
  return (
    <Stack
      spacing={2}
    >
      <Info />
      <ManualControl />
    </Stack>
  );
}

export default App;
