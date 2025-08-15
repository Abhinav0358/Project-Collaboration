from flask import current_app, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId

def get_db():
    return current_app.config["DB"]

def current_user_id():
    # we store user_id string in JWT identity
    return get_jwt_identity()

def to_object_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return None

def is_admin(project_doc, user_id_str):
    return str(project_doc.get("admin_id")) == user_id_str

def ensure_project_and_role(project_id, require_member=True):
    """
    Returns (project_doc, error_response or None)
    If require_member=True, checks current user is admin or collaborator.
    """
    db = get_db()
    oid = to_object_id(project_id)
    if not oid:
        return None, (jsonify({"error": "Invalid project id"}), 400)

    proj = db.projects.find_one({"_id": oid})
    if not proj:
        return None, (jsonify({"error": "Project not found"}), 404)

    if require_member:
        uid = current_user_id()
        is_member = (str(proj["admin_id"]) == uid) or (uid in [str(x) for x in proj.get("collaborator_ids", [])])
        if not is_member:
            return None, (jsonify({"error": "Forbidden"}), 403)

    return proj, None
