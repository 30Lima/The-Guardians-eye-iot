#include "DHT.h"
#include <TinyGPS++.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define DHTPIN 15
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define AIR_QUALITY_PIN 35
#define LED_PIN 2

// Wi-Fi para Wokwi (rede pública do simulador)
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// Broker MQTT público para testes
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "esp32/dados";

WiFiClient espClient;
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;

void setup_wifi() {
  delay(10);
  Serial.print("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado! IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado!");
    } else {
      Serial.print("Erro: ");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17); // GPS: RX=16, TX=17
  dht.begin();
  pinMode(LED_PIN, OUTPUT);

  setup_wifi();

  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();

  // Ler GPS
  while (Serial2.available() > 0) {
    gps.encode(Serial2.read());
  }

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int soilRaw = analogRead(SOIL_PIN);
  float soilPercent = map(soilRaw, 0, 4095, 0, 100);
  int airQuality = analogRead(AIR_QUALITY_PIN);

  // URL baseada nas condições
  String urlImagem = "";
  if (temperature > 35) {
    urlImagem = "https://exemplo.com/incendio.jpg";
  } else if (soilPercent < 30) {
    urlImagem = "https://exemplo.com/seca.jpg";
  } else if (soilPercent > 80) {
    urlImagem = "https://exemplo.com/enchente.jpg";
  } else if (airQuality > 2500) {
    urlImagem = "https://exemplo.com/poluicao.jpg";
  }

  if (urlImagem != "") {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  String latitude = gps.location.isValid() ? String(gps.location.lat(), 6) : "0.000000";
  String longitude = gps.location.isValid() ? String(gps.location.lng(), 6) : "0.000000";

  String payload = "{";
  payload += "\"temperature\":" + String(temperature, 2) + ",";
  payload += "\"humidity\":" + String(humidity, 2) + ",";
  payload += "\"soil\":" + String(soilPercent, 2) + ",";
  payload += "\"air_quality\":" + String(airQuality) + ",";
  payload += "\"latitude\":\"" + latitude + "\",";
  payload += "\"longitude\":\"" + longitude + "\",";
  payload += "\"url\":\"" + urlImagem + "\"";
  payload += "}";

  Serial.println("Publicando MQTT:");
  Serial.println(payload);
  client.publish(mqtt_topic, payload.c_str());

  delay(1); 
}
