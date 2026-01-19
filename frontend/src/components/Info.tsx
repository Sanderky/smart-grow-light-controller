import { Box, Divider, Stack, Typography, Skeleton } from "@mui/material";
import { ErrorOutline, LocalFlorist } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "../api/schedule";
import BoxWrapper from "./BoxWrapper";
import dayjs from "dayjs";

const Info = () => {
  const {
    data: status,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["systemStatus"],
    queryFn: scheduleApi.getStatus,
    refetchInterval: 1000
  });

  const logo = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: 1,
        mb: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "1.5rem" }}>
        Smart Grow
        <Typography
          component="span"
          variant="h1"
          sx={{ color: "primary.main", ml: 1, fontSize: "1.5rem" }}
        >
          Light Controller
        </Typography>
      </Typography>
      <LocalFlorist
        fontSize="medium"
        sx={(theme) => ({ color: theme.palette.primary.main })}
      />
    </Box>
  );

  if (isLoading) {
    return (
      <BoxWrapper>
        {logo}
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ mt: 2, borderRadius: 2 }}
        />
      </BoxWrapper>
    );
  }

  if (isError || !status) {
    return (
      <BoxWrapper>
        {logo}
        <Stack direction="row" gap={1}>
          <ErrorOutline color="error" />
          <Typography color="error">Błąd połączenia ze sterownikiem</Typography>
        </Stack>
      </BoxWrapper>
    );
  }

  const renderNextEvent = () => {
    if (!status?.nextEvent) return "Brak wpisów w harmonogramie";

    const { action, minutesLeft, time, day } = status.nextEvent;

    const days = Math.floor(minutesLeft / (24 * 60));
    const hours = Math.floor((minutesLeft % (24 * 60)) / 60);
    const mins = (minutesLeft % 60) + 1;

    let timeText = "";

    if (days > 0) {
      const suffix = days === 1 ? "dzień" : "dni";
      timeText += `${days} ${suffix} `;
    }

    if (hours > 0 || days > 0) {
      timeText += `${hours}h `;
    }

    timeText += `${mins}min`;

    const actionText = action === "ON" ? "włączenie" : "wyłączenie";
    const dayText = days > 0 ? " " + dayjs().day(day).format("dddd") : "";

    const timeDisplay = time.length > 5 ? time.slice(0, 5) : time;

    return `Najbliższe ${actionText} za ${timeText} (godz. ${timeDisplay}${dayText})`;
  };

  return (
    <BoxWrapper>
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {logo}

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">Status oświetlenia:</Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            color={status.lightState === "ON" ? "success.main" : "error.main"}
          >
            {status.lightState === "ON" ? "włączone" : "wyłączone"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">Harmonogram:</Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            color={status.scheduleEnabled ? "success.main" : "error.main"}
          >
            {status.scheduleEnabled ? "aktywny" : "nieaktywny"}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{ fontStyle: "italic", color: "text.secondary" }}
        >
          {renderNextEvent()}
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={0.5} sx={{ mt: 2 }}>
        <Box display="flex" sx={{ gap: 1 }}>
          <Typography color="text.secondary">Data serwera:</Typography>
          <Typography fontWeight="bold">{status.serverDate}</Typography>
        </Box>
        <Box display="flex" sx={{ gap: 1 }}>
          <Typography color="text.secondary">Godzina serwera:</Typography>
          <Typography fontWeight="bold">
            {status.serverTime?.slice(0, 5)}
          </Typography>
        </Box>
      </Stack>
    </BoxWrapper>
  );
};

export default Info;
