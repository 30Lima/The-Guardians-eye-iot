from flask import Blueprint, render_template, jsonify
import json

bp = Blueprint("main", __name__)

@bp.route("/")
def dashboard():
    return render_template("dashboard.html")

@bp.route("/data")
def get_data():
    try:
        with open("data/log.json", "r") as f:
            lines = f.readlines()[-30:]  # Últimos 30 registros
            data = [json.loads(line) for line in lines]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})
