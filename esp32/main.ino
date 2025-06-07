#include "DHT.h"
#include <TinyGPS++.h>

#define DHTPIN 15
#define DHTTYPE DHT22
#define SOIL_PIN 34
#define AIR_QUALITY_PIN 35
#define LED_PIN 2

DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17); // GPS ligado RX=16, TX=17 no ESP32
  dht.begin();
  pinMode(LED_PIN, OUTPUT);
}

void loop(){
    while (Serial2.available() > 0) {
    gps.encode(Serial2.read());
    }

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    int soilRaw = analogRead(SOIL_PIN);
    float soilPercent = map(soilRaw, 0, 4095, 0, 100);

    int airQuality = analogRead(AIR_QUALITY_PIN);

    Serial.print("Temperatura: ");
    Serial.print(temperature);
    Serial.print(" °C, Umidade: ");
    Serial.print(humidity);
    Serial.print(" %, Umidade do Solo: ");
    Serial.print(soilPercent);
    Serial.print(" %, Qualidade do Ar (valor bruto): ");
    Serial.println(airQuality);
}

