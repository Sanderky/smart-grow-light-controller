require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
require("dayjs/locale/pl");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pl");

const PORT = process.env.PORT || 3000;
const MQTT_HOST = process.env.MQTT_URL || "mqtt://192.168.1.14:1883";
const MQTT_TOPIC = process.env.MQTT_TOPIC || "growlight/cmd";
const DB_FILE = path.join(__dirname, "db.json");

// DB
let dbData = {
  settings: { scheduleEnabled: true },
  events: [],
};

const loadDatabase = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      console.log("[DB] Creating DB file...");
      saveDatabase();
      return;
    }
    const fileContent = fs.readFileSync(DB_FILE, "utf-8");
    dbData = JSON.parse(fileContent);
    console.log("[DB] DB loaded");
  } catch (err) {
    console.error("[DB] Loading error!", err);
  }
};

const saveDatabase = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
  } catch (err) {
    console.error("[DB] Saving error:", err);
  }
};

loadDatabase();
let currentLightState = "OFF";

const client = mqtt.connect(MQTT_HOST);

client.on("connect", () => {
  console.log(`[MQTT] Connected: ${MQTT_HOST}`);
});

const app = express();
app.use(cors());
app.use(express.json());

// ENDPOINTS
// status
app.get("/api/status", (req, res) => {
  const now = dayjs();

  let nextChange = null;
  let minMinutes = Infinity;

  if (dbData.events.length > 0) {
    dbData.events.forEach((event) => {
      const [h, m] = event.time.split(":").map(Number);

      event.days.forEach((dayIndex) => {
        let eventDate = dayjs(now).day(dayIndex).hour(h).minute(m).second(0);
        if (eventDate.isBefore(now)) {
          eventDate = eventDate.add(1, "week");
        }
        const diff = eventDate.diff(now, "minute");
        if (diff < minMinutes) {
          minMinutes = diff;
          nextChange = {
            action: event.action,
            minutesLeft: minMinutes,
            time: event.time,
            day: dayIndex
          };
        }
      });
    });
  }

  res.json({
    lightState: currentLightState,
    scheduleEnabled: dbData.settings.scheduleEnabled,
    serverTime: now.format("HH:mm:ss"),
    serverDate: now.format("DD MMMM YYYY"),
    nextEvent: nextChange,
  });
});

// manual
app.post("/api/light/:action", (req, res) => {
  const { action } = req.params;
  const payload = action.toUpperCase();

  if (payload !== "ON" && payload !== "OFF")
    return res.status(400).json({ error: "Invalid action" });

  client.publish(MQTT_TOPIC, action.toLowerCase());
  currentLightState = payload;

  res.json({ success: true, newState: currentLightState });
});

// on/off schedule
app.post("/api/settings/schedule", (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled !== "boolean") return res.status(400).send("Bad Request");

  dbData.settings.scheduleEnabled = enabled;
  saveDatabase();

  console.log(`[Settings] Schedule ${enabled ? "ON" : "OFF"}`);
  res.json({ success: true, enabled: dbData.settings.scheduleEnabled });
});

// all schedules
app.get("/api/schedule", (req, res) => {
  res.json(dbData.events);
});

// new schedule
app.post("/api/schedule", (req, res) => {
  const newRule = {
    id: Date.now(),
    days: req.body.days,
    time: req.body.time, // "HH:mm"
    action: req.body.action,
  };

  dbData.events.push(newRule);
  saveDatabase();

  console.log("[Schedule] New schedule added:", newRule);
  res.json({ success: true, rule: newRule });
});

// edit schedule
app.put("/api/schedule/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = dbData.events.findIndex((r) => r.id === id);

  if (index !== -1) {
    dbData.events[index] = { ...dbData.events[index], ...req.body };
    saveDatabase();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// delete schedule
app.delete("/api/schedule/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = dbData.events.length;

  dbData.events = dbData.events.filter((r) => r.id !== id);

  if (dbData.events.length !== initialLength) {
    saveDatabase();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// MAIN LOOP
setInterval(() => {
  if (!dbData.settings.scheduleEnabled) return;

  const now = dayjs();
  const currentDay = now.day();
  const currentTimeString = now.format("HH:mm");

  dbData.events.forEach((event) => {
    if (event.days.includes(currentDay)) {
      if (event.time === currentTimeString) {
        const payload = event.action;
        if (currentLightState !== payload) {
          console.log(`[Scheduler] ACTION: ${payload}`);
          client.publish(MQTT_TOPIC, payload.toLowerCase());
          currentLightState = payload;
        }
      }
    }
  });
}, 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
