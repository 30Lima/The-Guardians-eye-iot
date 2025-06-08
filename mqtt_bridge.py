import json
import paho.mqtt.client as mqtt
from datetime import datetime

LOG_PATH = "data/log.json"

def on_connect(client, userdata, flags, rc):
    print("Conectado ao broker com código:", rc)
    client.subscribe("esp32/dados")

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print("Mensagem recebida:", payload)

    try:
        data = json.loads(payload)
        data["timestamp"] = datetime.now().isoformat()

        with open(LOG_PATH, "a") as f:
            f.write(json.dumps(data) + "\n")

    except Exception as e:
        print("Erro ao salvar:", e)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("broker.hivemq.com", 1883, 60)
client.loop_forever()
