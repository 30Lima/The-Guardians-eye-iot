from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

DATA_FILE = 'data/log.json'

# Garante que o arquivo exista
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@app.route('/')
def index():
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return render_template('index.html', data=data)

@app.route('/api/data', methods=['POST'])
def receive_data():
    content = request.json
    content['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with open(DATA_FILE, 'r+') as f:
        log = json.load(f)
        log.insert(0, content)
        f.seek(0)
        json.dump(log, f, indent=2)

    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)
