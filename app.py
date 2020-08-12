"""A Python Flask REST API BoilerPlate (CRUD) Style"""

import argparse
import os
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from backend.routes import movies_api, actors_api, auth_api
from backend.models import setup_db
from backend.auth.auth import AuthError

SWAGGER_URL = '/swagger'
API_URL = '/api_specs/swagger.json'

def setup_swagger_ui(app):
    ''' Setup Swagger UI '''
    ### swagger specific ###
    swagger_ui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Casting Agency FSND Capstone"
        }
    )
    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)
    ### end swagger specific ###

def setup_blueprints(app):
    ''' Setup Blueprints '''
    app.register_blueprint(movies_api.get_blueprint(), url_prefix="/api/movies")
    app.register_blueprint(actors_api.get_blueprint(), url_prefix="/api/actors")
    app.register_blueprint(auth_api.get_blueprint(), url_prefix="/api/auth")

def create_app():
    ''' Create Flask App '''
    app = Flask(__name__, static_folder="build", template_folder="build", static_url_path="/")

    # Setup secret key
    app.secret_key = os.environ.get('APP_SECRET_KEY')

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    setup_db(app)
    setup_swagger_ui(app)
    auth_api.oauthHelper.setup_oauth(app)
    setup_blueprints(app)
    return app

APP = create_app()


@APP.route("/")
def index():
    ''' Default UI Route '''
    return render_template('index.html')

@APP.after_request
def after_request(response):
    ''' Adds CORS headers '''
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE')
    return response

@APP.errorhandler(400)
def handle_400_error(error):
    """Return a http 400 error to client"""
    return jsonify({
        "success": False,
        "error": error.code,
        "code": 'bad_request',
        "message": error.description
    }), 400


@APP.errorhandler(401)
def handle_401_error(error):
    """Return a http 401 error to client"""
    return jsonify({
        "success": False,
        "error": error.code,
        "code": 'unauthorized',
        "message": error.description
    }), 401


@APP.errorhandler(404)
def handle_404_error(error):
    """Return a http 404 error to client"""
    return jsonify({
        "success": False,
        "error": error.code,
        "code": 'not_found',
        "message": error.description
    }), 404


@APP.errorhandler(500)
def handle_500_error(error):
    """Return a http 500 error to client"""
    return jsonify({
        "success": False,
        "error": error.code,
        "code": 'internal_server_error',
        "message": error.get("description")
    }), 500

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    '''Return a 401 authentication error to client'''
    return jsonify({
        "success": False,
        "error": ex.status_code,
        "code": ex.error.get("code"),
        "message": ex.error.get("description")
    }), ex.status_code

if __name__ == '__main__':
    PARSER = argparse.ArgumentParser(
        description="Casting Agency - FSND Capstone App")

    PARSER.add_argument('--debug', action='store_true',
                        help="Use flask debug/dev mode with file change reloading")
    ARGS = PARSER.parse_args()

    PORT = int(os.environ.get('PORT', 5000))

    if ARGS.debug:
        print("Running in debug mode")
        APP.run(host='0.0.0.0', port=PORT, debug=True)
    else:
        APP.run(host='0.0.0.0', port=PORT, debug=False)
