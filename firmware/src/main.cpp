#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "secrets.h"  
#define LED_PIN 23   // pin z Twoim LED-em


const int   MQTT_PORT = 1883;
const char* MQTT_TOPIC_CMD = "growlight/cmd";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ====== CALLBACK MQTT ======
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  Serial.print("MQTT [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.println(msg);

  if (String(topic) == MQTT_TOPIC_CMD) {
    if (msg == "on") {
      digitalWrite(LED_PIN, HIGH);
      
    } else if (msg == "off") {
      digitalWrite(LED_PIN, LOW);
    }
  }
}

// ====== WIFI ======
void connectWiFi() {
  Serial.print("Łączenie z WiFi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nPołączono z WiFi, IP: " + WiFi.localIP().toString());
}

// ====== MQTT ======
void connectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Łączenie z MQTT...");
    if (mqttClient.connect("esp32-growlight")) {   // ID klienta
      Serial.println("OK");
      mqttClient.subscribe(MQTT_TOPIC_CMD);
      Serial.print("Subskrybuję topic: ");
      Serial.println(MQTT_TOPIC_CMD);
    } else {
      Serial.print("błąd, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" ponowna próba za 5s");
      delay(5000);
    }
  }
}

// ====== SETUP ======
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  connectWiFi();

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
}

// ====== LOOP ======
void loop() {
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();   // obsługa MQTT
}
