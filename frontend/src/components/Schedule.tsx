import { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  useTheme,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  alpha,
  type Theme,
  Switch,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Sunny,
  Nightlight,
  ArrowDownward,
} from "@mui/icons-material";

import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pl";
import BoxWrapper from "./BoxWrapper";
import { plPL } from "@mui/x-date-pickers/locales";

dayjs.locale("pl");

type ActionType = "ON" | "OFF";

interface ScheduleEvent {
  id: number;
  days: number[];
  time: Dayjs | null;
  action: ActionType;
}

const DAYS_UI = [
  { value: 1, label: "Pn" },
  { value: 2, label: "Wt" },
  { value: 3, label: "Śr" },
  { value: 4, label: "Cz" },
  { value: 5, label: "Pt" },
  { value: 6, label: "Sb" },
  { value: 0, label: "Nd" },
];

type DayCirleMode = "normal" | "day" | "night";

interface DayCircleProps {
  day: {
    value: number;
    label: string;
  };
  isSelected: boolean;
  onClick?: (dayValue: number) => void;
  readOnly?: boolean;
  mode?: DayCirleMode;
}

const DayCircle = ({
  day,
  isSelected,
  onClick,
  readOnly = false,
  mode = "normal",
}: DayCircleProps) => {
  const getBgColor = (theme: Theme) => {
    switch (mode) {
      case "normal":
        return theme.palette.text.primary;
      case "day":
        return theme.palette.day.main;
      case "night":
        return theme.palette.night.main;
    }
  };

  const getTextColor = (theme: Theme) => {
    switch (mode) {
      case "normal":
        return theme.palette.common.black;
      case "day":
        return theme.palette.day.contrastText;
      case "night":
        return theme.palette.night.contrastText;
    }
  };

  return (
    <Box
      onClick={
        readOnly
          ? undefined
          : () => {
              if (onClick) onClick(day.value);
            }
      }
      sx={(theme) => ({
        width: 50,
        height: 50,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: readOnly ? "default" : "pointer",
        fontSize: "0.75rem",
        fontWeight: isSelected ? "bold" : "normal",
        transition: "all 0.2s",
        bgcolor: isSelected ? getBgColor(theme) : "transparent",
        color: isSelected ? getTextColor(theme) : getBgColor(theme),
        border: `1px solid ${getBgColor(theme)}`,
        opacity: !isSelected && readOnly ? 0.5 : 1,
      })}
    >
      {day.label}
    </Box>
  );
};

const Schedule = () => {
  const theme = useTheme();

  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: 1,
      days: [1, 2, 3, 4, 5],
      time: dayjs().set("hour", 7).set("minute", 0),
      action: "ON",
    },
    {
      id: 2,
      days: [1, 2, 3, 4, 5],
      time: dayjs().set("hour", 23).set("minute", 0),
      action: "OFF",
    },
  ]);

  const [formDays, setFormDays] = useState<number[]>([]);
  const [formTime, setFormTime] = useState<Dayjs | null>(dayjs());
  const [formAction, setFormAction] = useState<ActionType>("ON");
  const [editingId, setEditingId] = useState<number | null>(null);

  const toggleDay = (dayValue: number) => {
    setFormDays((prev) =>
      prev.includes(dayValue)
        ? prev.filter((d) => d !== dayValue)
        : [...prev, dayValue],
    );
  };

  const resetForm = () => {
    setFormDays([]);
    setFormTime(dayjs());
    setFormAction("ON");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formTime || formDays.length === 0) return;

    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? { ...ev, days: formDays, time: formTime, action: formAction }
            : ev,
        ),
      );
    } else {
      const newEvent: ScheduleEvent = {
        id: Date.now(),
        days: formDays,
        time: formTime,
        action: formAction,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    resetForm();
  };

  const handleEditClick = (ev: ScheduleEvent) => {
    setEditingId(ev.id);
    setFormDays(ev.days);
    setFormTime(ev.time);
    setFormAction(ev.action);
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <BoxWrapper>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pl"
        localeText={
          plPL.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ mb: 3 }}
        >
          <Typography variant="h3">Harmonogram</Typography>
          <Switch defaultChecked />
        </Stack>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {events.length > 0 ? (
            events.map((ev) => {
              const isOn = ev.action === "ON";

              return (
                <Card
                  key={ev.id}
                  sx={{
                    bgcolor: isOn
                      ? alpha(theme.palette.day.main, 0.16)
                      : alpha(theme.palette.night.main, 0.16),
                    borderLeft: `6px solid ${isOn ? theme.palette.day.main : theme.palette.night.main}`,
                    outline:
                      editingId === ev.id
                        ? `3px solid ${theme.palette.text.primary}`
                        : "none",
                  }}
                >
                  <CardContent
                    sx={{
                      pb: "16px !important",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={1}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {ev.time?.format("HH:mm")}
                        </Typography>
                        <Chip
                          label={isOn ? "WŁĄCZ" : "WYŁĄCZ"}
                          size="small"
                          sx={{
                            color: "text.primary",
                            borderColor: "text.primary",
                          }}
                          variant="outlined"
                        />
                      </Stack>

                      <Stack direction="row" gap={1} flexWrap={'wrap'}>
                        {DAYS_UI.map((day) => (
                          <DayCircle
                            mode={isOn ? "day" : "night"}
                            key={day.value}
                            day={day}
                            readOnly={true}
                            isSelected={ev.days.includes(day.value)}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Stack direction="row">
                      <Tooltip title="Edytuj">
                        <IconButton
                          onClick={() => handleEditClick(ev)}
                          size="small"
                        >
                          <EditIcon
                            sx={{ color: "text.primary" }}
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Usuń">
                        <IconButton
                          onClick={() => handleDelete(ev.id)}
                          size="small"
                        >
                          <DeleteIcon
                            sx={{ color: "text.primary" }}
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography>Brak harmonogramów</Typography>
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
                justifyContent={"center"}
                mt={1}
              >
                <ArrowDownward
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Typography sx={{ color: "primary.main" }}>
                  Dodaj pierwszy poniżej
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>

        <Box
          sx={{
            p: 2,
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            color="textPrimary"
            sx={{ mb: 2, textTransform: "uppercase" }}
          >
            {editingId ? "Edytuj harmonogram" : "Dodaj harmonogram"}
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <ToggleButtonGroup
                value={formAction}
                exclusive
                onChange={(_, newVal) => newVal && setFormAction(newVal)}
                fullWidth
                size="small"
              >
                <ToggleButton value="ON" color="day">
                  <Sunny sx={{ mr: 1 }} /> Włącz
                </ToggleButton>
                <ToggleButton value="OFF" color="night">
                  <Nightlight sx={{ mr: 1 }} /> Wyłącz
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TimePicker
                label="Godzina"
                value={formTime}
                onChange={(newValue) => setFormTime(newValue)}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                ampm={false}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                gap={1}
                justifyContent={"center"}
                sx={{ mt: 2 }}
                flexWrap={'wrap'}
              >
                {DAYS_UI.map((day) => (
                  <DayCircle
                    key={day.value}
                    day={day}
                    isSelected={formDays.includes(day.value)}
                    onClick={toggleDay}
                  />
                ))}
              </Stack>
            </Grid>

            <Grid
              size={12}
              display="flex"
              justifyContent="flex-end"
              color="text.primary"
            >
              {editingId && (
                <Button
                  onClick={resetForm}
                  sx={{ mr: 1 }}
                  size="small"
                  color="inherit"
                  variant="outlined"
                >
                  Anuluj
                </Button>
              )}
              <Button
                variant="contained"
                size={"small"}
                startIcon={editingId ? <SaveIcon /> : <AddIcon />}
                onClick={handleSave}
                disabled={formDays.length === 0}
                color={"primary"}
              >
                {editingId ? "Zapisz" : "Dodaj"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </BoxWrapper>
  );
};

export default Schedule;
