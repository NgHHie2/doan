from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import json

app = Flask(__name__)

# CORS cho tất cả localhost ports
CORS(app, origins="*", supports_credentials=True, methods=["GET", "POST", "OPTIONS"], allow_headers="*")

# URL của Kaggle API (thay bằng ngrok URL của bạn)
KAGGLE_API_URL = "https://YOUR_NGROK_URL.ngrok-free.app"

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Proxy service is running"})

@app.route("/generate", methods=["POST"])
def generate():
    """Forward request đến Kaggle API (non-streaming)"""
    try:
        data = request.get_json()
        
        # Forward request đến Kaggle
        response = requests.post(
            f"{KAGGLE_API_URL}/generate",
            json=data,
            timeout=500
        )
        
        return jsonify(response.json()), response.status_code
    
    except requests.Timeout:
        return jsonify({"error": "Request timeout"}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-stream", methods=["POST"])
def generate_stream():
    """Forward streaming request đến Kaggle API"""
    try:
        data = request.get_json()
        
        def stream():
            # Stream từ Kaggle API
            with requests.post(
                f"{KAGGLE_API_URL}/generate-stream",
                json=data,
                stream=True,
                timeout=500
            ) as response:
                for line in response.iter_lines():
                    if line:
                        yield line.decode('utf-8') + '\n'
        
        return Response(stream(), mimetype="text/event-stream")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/set-kaggle-url", methods=["POST"])
def set_kaggle_url():
    """Cập nhật Kaggle API URL"""
    global KAGGLE_API_URL
    data = request.get_json()
    new_url = data.get("url", "")
    
    if new_url:
        KAGGLE_API_URL = new_url.rstrip('/')
        return jsonify({"message": f"Kaggle URL updated to: {KAGGLE_API_URL}"})
    
    return jsonify({"error": "No URL provided"}), 400

@app.route("/get-kaggle-url", methods=["GET"])
def get_kaggle_url():
    """Lấy Kaggle API URL hiện tại"""
    return jsonify({"kaggle_url": KAGGLE_API_URL})

if __name__ == "__main__":
    print("="*50)
    print("Local Proxy Service")
    print("="*50)
    print(f"Running on: http://localhost:8000")
    print(f"Forwarding to: {KAGGLE_API_URL}")
    print("="*50)
    
    app.run(host="0.0.0.0", port=8000, debug=False, threaded=True)