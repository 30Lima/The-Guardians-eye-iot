from flask import Blueprint, render_template, jsonify, request
import json

bp = Blueprint("main", __name__)

@bp.route("/")
def dashboard():
    return render_template("dashboard.html")

@bp.route("/data")
def get_data():
    try:
        with open("data/log.json", "r") as f:
            data = json.load(f)  # Lê o JSON inteiro como lista de dicionários
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})
    

@bp.route("/graph-data")
def graph_data():
    try:
        with open("data/log.json", "r") as f:
            data = json.load(f)
        # Aqui a gente paginar também
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 30))
        start = (page - 1) * per_page
        end = start + per_page
        paged_data = data[start:end]

        return jsonify({
            "page": page,
            "per_page": per_page,
            "total": len(data),
            "data": paged_data
        })
    except Exception as e:
        return jsonify({"error": str(e)})

@bp.route("/graph")
def graph():
    return render_template("graph.html")
