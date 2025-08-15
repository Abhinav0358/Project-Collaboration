from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config

client = None
db = None

def create_app():
    global client, db
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # Restrict origins in prod
    JWTManager(app)

    client = MongoClient(app.config["MONGO_URI"])
    db = client.get_database()  # default DB from URI

    # Basic indexes (safe to re-run)
    db.users.create_index("email", unique=True)
    db.projects.create_index("admin_id")
    db.projects.create_index("collaborator_ids")
    db.tasks.create_index("project_id")
    db.tasks.create_index("assignee_id")

    # attach db to app for route access
    app.config["DB"] = db

    from routes.auth_routes import auth_bp
    from routes.project_routes import project_bp
    from routes.task_routes import task_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(task_bp)

    return app

app = create_app()

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
