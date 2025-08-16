from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from utils.auth import get_db, current_user_id, to_object_id, is_admin, ensure_project_and_role

project_bp = Blueprint("projects", __name__)

# Create a project (current user becomes admin)
@project_bp.post("/projects")
@jwt_required()
def create_project():
    db = get_db()
    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description", "")
    domain = data.get("domain", "")
    start_date = data.get("start_date")  # ISO string "YYYY-MM-DD"
    end_date = data.get("end_date")      # ISO string "YYYY-MM-DD"

    if not name:
        return jsonify({"error": "name required"}), 400

    admin_id = ObjectId(current_user_id())
    doc = {
        "name": name,
        "description": description,
        "domain": domain,
        "start_date": start_date,
        "end_date": end_date,  
        "admin_id": admin_id,
        "collaborator_ids": []  # list of ObjectId
    }
    res = db.projects.insert_one(doc)
    return jsonify({"_id": str(res.inserted_id)}), 201

# List projects visible to the current user (admin or collaborator)
@project_bp.get("/projects")
@jwt_required()
def list_projects():
    db = get_db()
    uid = ObjectId(current_user_id())
    cursor = db.projects.find({
        "$or": [
            {"admin_id": uid},
            {"collaborator_ids": uid}
        ]
    })
    out = []
    for p in cursor:
        out.append({
            "_id": str(p["_id"]),
            "name": p.get("name"),
            "description": p.get("description"),
            "domain": p.get("domain"),
            "start_date": p.get("start_date"),
            "end_date": p.get("end_date"),
            "admin": str(p["admin_id"]),
            "collaborators": [str(x) for x in p.get("collaborator_ids", [])]
        })
    return jsonify(out)

# Get project details
@project_bp.get("/projects/<project_id>")
@jwt_required()
def get_project(project_id):
    db = get_db()
    proj, err = ensure_project_and_role(project_id, require_member=True)
    if err:
        return err
    p = proj
    return jsonify({
        "_id": str(p["_id"]),
        "name": p.get("name"),
        "description": p.get("description"),
        "domain": p.get("domain"),
        "start_date": p.get("start_date"),
        "end_date": p.get("end_date"),
        "admin": str(p["admin_id"]),
        "collaborators": [str(x) for x in p.get("collaborator_ids", [])]
    })

# Save project (update name/desc/start/end) — admin only
@project_bp.put("/projects/<project_id>/save")
@jwt_required()
def save_project(project_id):
    db = get_db()
    proj, err = ensure_project_and_role(project_id, require_member=True)
    if err:
        return err

    if not is_admin(proj, current_user_id()):
        return jsonify({"error": "Only admin can update project"}), 403

    data = request.get_json() or {}
    updates = {}
    for k in ("name", "description", "start_date", "end_date", "domain"):
        if k in data:
            updates[k] = data[k]

    if not updates:
        return jsonify({"error": "No fields to update"}), 400

    db.projects.update_one({"_id": proj["_id"]}, {"$set": updates})
    return jsonify({"message": "Project updated"})

# Add collaborator — admin only (by user_id)
@project_bp.post("/projects/<project_id>/collaborators")
@jwt_required()
def add_collaborator(project_id):
    db = get_db()
    proj, err = ensure_project_and_role(project_id, require_member=True)
    if err:
        return err

    if not is_admin(proj, current_user_id()):
        return jsonify({"error": "Only admin can add collaborators"}), 403

    data = request.get_json() or {}
    user_id_str = data.get("user_id")
    oid = to_object_id(user_id_str)
    if not oid:
        return jsonify({"error": "Invalid user_id"}), 400

    if not db.users.find_one({"_id": oid}):
        return jsonify({"error": "User not found"}), 404

    db.projects.update_one({"_id": proj["_id"]}, {"$addToSet": {"collaborator_ids": oid}})
    return jsonify({"message": "Collaborator added"})
