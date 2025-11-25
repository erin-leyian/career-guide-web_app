from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend → backend calls

# Make sure Flask returns UTF-8 instead of latin-1
app.config['JSON_AS_ASCII'] = False

API_KEY = os.getenv("RAPID_API_KEY")


@app.route("/api/jobs")
def get_jobs():
    query = request.args.get("q")

    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    url = "https://jsearch.p.rapidapi.com/search"

    headers = {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }

    params = {
        "query": query,
        "num_pages": 1
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=15)
        data = response.json()
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)