
from pathlib import Path
import sqlite3
from functools import wraps

import joblib
import pandas as pd
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "artifacts" / "placement_model.joblib"
DB_PATH = BASE_DIR / "getplaced_users.db"

# Load the trained ML model
if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Trained model not found: {MODEL_PATH}. Run train_model.py first."
    )

saved_data = joblib.load(MODEL_PATH)
model = saved_data["model"]
FEATURES = saved_data["features"]
MODEL_NAME = saved_data["model_name"]

NUMERIC_FEATURES = [
    "CGPA", "Internships", "Projects", "Workshops/Certifications",
    "AptitudeTestScore", "SoftSkillsRating", "SSC_Marks", "HSC_Marks",
]

CATEGORICAL_FEATURES = [
    feature for feature in FEATURES if feature not in NUMERIC_FEATURES
]


# ---------- SQLite database ----------
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    with sqlite3.connect(DB_PATH) as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


init_db()


# ---------- Authentication APIs ----------
@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required."}), 400

    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return jsonify({"error": "Please enter a valid email address."}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400

    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, generate_password_hash(password)),
        )
        db.commit()
        return jsonify({"message": "Registration successful. Please log in."}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "An account with this email already exists."}), 409


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = get_db().execute(
        "SELECT id, name, email, password_hash FROM users WHERE email = ?",
        (email,),
    ).fetchone()

    if user is None or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
        },
    }), 200


# ---------- Existing ML APIs ----------
@app.get("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "GetPlaced API is running",
        "model": MODEL_NAME,
    })


@app.get("/api/model-info")
def model_info():
    import json

    evaluation_path = BASE_DIR / "artifacts" / "evaluation.json"
    evaluation = {}

    if evaluation_path.exists():
        with open(evaluation_path, "r", encoding="utf-8") as file:
            evaluation = json.load(file)

    return jsonify({
        "model": MODEL_NAME,
        "features": FEATURES,
        "validation": evaluation.get("validation", {}),
        "note": (
            "Predictions are estimates based on dataset patterns, "
            "not guarantees of actual placement."
        ),
    })


@app.post("/api/predict")
def predict():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Please send student details as JSON."}), 400

    missing = [
        feature for feature in FEATURES
        if feature not in data or data[feature] in (None, "")
    ]

    if missing:
        return jsonify({
            "error": "Some required fields are missing.",
            "missing_fields": missing,
        }), 400

    student = {}

    try:
        for feature in NUMERIC_FEATURES:
            if feature in FEATURES:
                value = float(data[feature])
                if not pd.notna(value):
                    raise ValueError(f"{feature} must be a valid number.")
                student[feature] = value

        for feature in CATEGORICAL_FEATURES:
            value = str(data[feature]).strip()
            if not value:
                raise ValueError(f"{feature} cannot be empty.")
            student[feature] = value

        student_df = pd.DataFrame(
            [[student[feature] for feature in FEATURES]],
            columns=FEATURES,
        )

        prediction = str(model.predict(student_df)[0])
        probabilities = model.predict_proba(student_df)[0]
        classes = model.named_steps["classifier"].classes_

        return jsonify({
            "prediction": prediction,
            "confidence": round(float(max(probabilities)) * 100, 2),
            "class_probabilities": {
                str(label): round(float(probability) * 100, 2)
                for label, probability in zip(classes, probabilities)
            },
            "model": MODEL_NAME,
            "disclaimer": (
                "This is a dataset-based estimate, not a guarantee "
                "of real-world placement."
            ),
        })

    except (ValueError, TypeError) as error:
        return jsonify({"error": f"Invalid student details: {error}"}), 400

    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({
            "error": "Prediction failed. Check the submitted values."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)