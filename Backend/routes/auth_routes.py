from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    db = current_app.config["DB"]
    data = request.get_json() or {}

    name = data.get("name")
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not (name and email and password):
        return jsonify({"error": "name, email, password required"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    user = {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
    }
    res = db.users.insert_one(user)
    user_id = str(res.inserted_id)

    token = create_access_token(identity=user_id)
    return jsonify({"message": "Registered", "user": {"_id": user_id, "name": name, "email": email}, "token": token}), 201

@auth_bp.post("/login")
def login():
    db = current_app.config["DB"]
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {"_id": str(user["_id"]), "name": user["name"], "email": user["email"]}
    })
