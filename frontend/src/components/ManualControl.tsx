import { Lightbulb, LightbulbOutline } from "@mui/icons-material";
import {
  Alert,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import BoxWrapper from "./BoxWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "../api/schedule";

const ManualControl = () => {
  const queryClient = useQueryClient();

  const {
    data: status,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["systemStatus"],
    queryFn: scheduleApi.getStatus,
    refetchInterval: 1000,
  });

  const isLightOn = status?.lightState === "ON";

  const { mutate, isPending } = useMutation({
    mutationFn: (action: "on" | "off") => scheduleApi.setLightState(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemStatus"] });
    },
    onError: () => {
      alert("Błąd podczas zmiany stanu światła!");
    },
  });

  const handleToggleLightStatus = () => {
    const newAction = isLightOn ? "off" : "on";
    mutate(newAction);
  };

  return (
    <BoxWrapper>
      <Typography variant="h3">Manualne sterowanie</Typography>
      <Stack direction={"row"} justifyContent={"center"}>
        {isLoading ? (
          <CircularProgress
            size={60}
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
        ) : (
          <IconButton
            onClick={handleToggleLightStatus}
            disabled={isError || isPending}
            sx={{
              mt: 2,
              mb: 2,
              opacity: isError ? 0.2 : 1,
            }}
          >
            {isLightOn ? (
              <Lightbulb
                sx={(theme) => ({
                  fontSize: 60,
                  color: theme.palette.primary.main,
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: "100%",
                  p: 1,
                })}
              />
            ) : (
              <LightbulbOutline
                sx={(theme) => ({
                  fontSize: 60,
                  color: theme.palette.primary.main,
                  border: `2px solid ${theme.palette.primary.main}`,
                  borderRadius: "100%",
                  p: 1,
                })}
              />
            )}
          </IconButton>
        )}
      </Stack>

      <Alert severity="warning">
        Oświetlenie zmieni swój stan zgodnie z harmonogramem.
      </Alert>
    </BoxWrapper>
  );
};

export default ManualControl;
