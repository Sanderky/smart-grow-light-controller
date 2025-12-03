const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");

// === KONFIGURACJA MQTT ===
// IP komputera, na którym działa broker Mosquitto
const MQTT_HOST = "mqtt://192.168.1.14:1883";
const MQTT_TOPIC = "growlight/cmd";

// === STAN APLIKACJI ===
let currentState = "off"; // "on" / "off"

// === INICJALIZACJA EXPRESS ===
const app = express();
app.use(cors());
app.use(express.json());

// === POŁĄCZENIE Z BROKEREM MQTT ===
const client = mqtt.connect(MQTT_HOST);

client.on("connect", () => {
  console.log("Połączono z MQTT:", MQTT_HOST);
});

// (opcjonalnie) logi z MQTT, jeśli coś przyjdzie na ten topic
client.on("message", (topic, payload) => {
  console.log("MQTT msg:", topic, payload.toString());
});

// ====== ENDPOINTY STEROWANIA LED (RĘCZNE) ======

// Włącz LED – sterowanie ręczne (POST)
app.post("/api/light/on", (req, res) => {
  client.publish(MQTT_TOPIC, "on");
  currentState = "on";
  console.log("MANUAL → on (POST)");
  res.json({ ok: true, state: "on" });
});

// Włącz LED – sterowanie ręczne (GET, do testów w przeglądarce)
app.get("/api/light/on", (req, res) => {
  client.publish(MQTT_TOPIC, "on");
  currentState = "on";
  console.log("MANUAL → on (GET)");
  res.json({ ok: true, state: "on" });
});

// Wyłącz LED – sterowanie ręczne (POST)
app.post("/api/light/off", (req, res) => {
  client.publish(MQTT_TOPIC, "off");
  currentState = "off";
  console.log("MANUAL → off (POST)");
  res.json({ ok: true, state: "off" });
});

// Wyłącz LED – sterowanie ręczne (GET)
app.get("/api/light/off", (req, res) => {
  client.publish(MQTT_TOPIC, "off");
  currentState = "off";
  console.log("MANUAL → off (GET)");
  res.json({ ok: true, state: "off" });
});

// ====== STATUS DLA FRONTENDU  ======
app.get("/api/status", (req, res) => {
  const now = new Date();
  res.json({
    state: currentState,
    serverDate: now.toISOString().slice(0, 10),
    serverTime: now.toTimeString().slice(0, 8),
  });
});

// Testowy endpoint
app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

// ====== START BACKENDU ======
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});
