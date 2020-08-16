"""A Python Flask REST API BoilerPlate (CRUD) Style"""

import os
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from dotenv import load_dotenv
from .routes import movies_api, actors_api, auth_api
from .models import setup_db
from .auth.auth import AuthError

""" Load Environment Variables"""
load_dotenv()

SWAGGER_URL = '/swagger'
API_URL = '/api_specs/swagger.json'

DEFAULT_POSTGRES_URL = "postgres://{}@{}/{}?gssencmode=disable"
database_name = os.getenv('DATABASE_NAME', "casting_agency")
database_path = os.getenv('DATABASE_URL', DEFAULT_POSTGRES_URL.format(
                                                'postgres',
                                                'localhost:5432',
                                                database_name))


def setup_swagger_ui(app):
    ''' Setup Swagger UI '''
    swagger_ui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Casting Agency FSND Capstone"
        }
    )
    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)


def setup_blueprints(app):
    ''' Setup Blueprints '''
    app.register_blueprint(movies_api.get_blueprint(),
                           url_prefix="/api/movies")
    app.register_blueprint(actors_api.get_blueprint(),
                           url_prefix="/api/actors")
    app.register_blueprint(auth_api.get_blueprint(),
                           url_prefix="/api/auth")


def create_app(test_config=None):
    ''' Create Flask App '''
    app = Flask(__name__, static_folder="../build", template_folder="../build",
                static_url_path="/")

    if test_config is None:
        app.config["SQLALCHEMY_DATABASE_URI"] = database_path
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        app.config['SECRET_KEY'] = os.environ.get('APP_SECRET_KEY')
    else:
        app.config.from_object(test_config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    setup_db(app)
    setup_swagger_ui(app)
    auth_api.oauthHelper.setup_oauth(app)
    setup_blueprints(app)

    @app.route("/")
    def index():
        ''' Default UI Route '''
        return render_template('index.html')

    @app.after_request
    def after_request(response):
        ''' Adds CORS headers '''
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET,PUT,POST,PATCH,DELETE')
        return response

    @app.errorhandler(400)
    def handle_400_error(error):
        """Return a http 400 error to client"""
        return jsonify({
            "success": False,
            "error": error.code,
            "code": 'bad_request',
            "message": error.description
        }), 400

    @app.errorhandler(401)
    def handle_401_error(error):
        """Return a http 401 error to client"""
        return jsonify({
            "success": False,
            "error": error.code,
            "code": 'unauthorized',
            "message": error.description
        }), 401

    @app.errorhandler(404)
    def handle_404_error(error):
        """Return a http 404 error to client"""
        return jsonify({
            "success": False,
            "error": error.code,
            "code": 'not_found',
            "message": error.description
        }), 404

    @app.errorhandler(500)
    def handle_500_error(error):
        """Return a http 500 error to client"""
        return jsonify({
            "success": False,
            "error": error.code,
            "code": 'internal_server_error',
            "message": error.get("description")
        }), 500

    @app.errorhandler(AuthError)
    def handle_auth_error(ex):
        '''Return a 401 authentication error to client'''
        return jsonify({
            "success": False,
            "error": ex.status_code,
            "code": ex.error.get("code"),
            "message": ex.error.get("description")
        }), ex.status_code

    return app
    """ End of create_db """
