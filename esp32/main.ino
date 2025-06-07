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