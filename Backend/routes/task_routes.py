from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from utils.auth import get_db, current_user_id, ensure_project_and_role, to_object_id

task_bp = Blueprint("tasks", __name__)

# Add a task for a collaborator (any project member can add)
@task_bp.post("/projects/<project_id>/tasks")
@jwt_required()
def add_task(project_id):
    db = get_db()
    proj, err = ensure_project_and_role(project_id, require_member=True)
    if err:
        return err

    data = request.get_json() or {}
    title = data.get("title")
    deadline = data.get("deadline")  # ISO "YYYY-MM-DD"
    status = data.get("status", "Pending")
    assignee_id = data.get("assignee_id")  # user_id string

    if not (title and deadline and assignee_id):
        return jsonify({"error": "title, deadline, assignee_id required"}), 400

    assignee_oid = to_object_id(assignee_id)
    if not assignee_oid:
        return jsonify({"error": "Invalid assignee_id"}), 400

    # Ensure assignee is the admin or collaborator
    valid_assignees = [str(proj["admin_id"])] + [str(x) for x in proj.get("collaborator_ids", [])]
    if str(assignee_oid) not in valid_assignees:
        return jsonify({"error": "Assignee not in project"}), 400

    doc = {
        "project_id": proj["_id"],
        "assignee_id": assignee_oid,
        "title": title,
        "deadline": deadline,
        "status": status  # "Pending" | "In Progress" | "Done"
    }
    res = db.tasks.insert_one(doc)
    return jsonify({"_id": str(res.inserted_id)}), 201

# List tasks for a project (optionally filter by assignee_id)
@task_bp.get("/projects/<project_id>/tasks")
@jwt_required()
def list_tasks(project_id):
    db = get_db()
    proj, err = ensure_project_and_role(project_id, require_member=True)
    if err:
        return err

    assignee_id = request.args.get("assignee_id")
    query = {"project_id": proj["_id"]}
    if assignee_id:
        oid = to_object_id(assignee_id)
        if not oid:
            return jsonify({"error": "Invalid assignee_id"}), 400
        query["assignee_id"] = oid

    out = []
    for t in db.tasks.find(query):
        out.append({
            "_id": str(t["_id"]),
            "project_id": str(t["project_id"]),
            "assignee_id": str(t["assignee_id"]),
            "title": t["title"],
            "deadline": t["deadline"],
            "status": t["status"]
        })
    return jsonify(out)

# Anybody can set task status (any project member)
@task_bp.patch("/tasks/<task_id>/status")
@jwt_required()
def update_task_status(task_id):
    db = get_db()
    tid = to_object_id(task_id)
    if not tid:
        return jsonify({"error": "Invalid task id"}), 400

    task = db.tasks.find_one({"_id": tid})
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Check requester is a member of the task's project
    proj = db.projects.find_one({"_id": task["project_id"]})
    uid = current_user_id()
    is_member = (str(proj["admin_id"]) == uid) or (uid in [str(x) for x in proj.get("collaborator_ids", [])])
    if not is_member:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or {}
    status = data.get("status")
    if status not in ["Pending", "In Progress", "Done"]:
        return jsonify({"error": "Invalid status"}), 400

    db.tasks.update_one({"_id": tid}, {"$set": {"status": status}})
    return jsonify({"message": "Status updated"})
