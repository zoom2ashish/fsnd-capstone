"""A Python Flask REST API BoilerPlate (CRUD) Style"""

import argparse
import os
from flask import Flask, jsonify, make_response, render_template
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from backend.routes import request_api, movies_api, actors_api
from backend.models import Movie, setup_db
from werkzeug import exceptions

def setup_swagger_ui(app):
    ### swagger specific ###
    SWAGGER_URL = '/swagger'
    API_URL = '/api_specs/swagger.json'
    SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Casting Agency FSND Capstone"
        }
    )
    app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
    ### end swagger specific ###

    app.register_blueprint(request_api.get_blueprint())
    app.register_blueprint(movies_api.get_blueprint(), url_prefix="/api/movies")
    app.register_blueprint(actors_api.get_blueprint(), url_prefix="/api/actors")

def create_app(test_config=None):
    app = Flask(__name__, static_folder="build", template_folder="build", static_url_path="/")
    CORS(app)
    setup_swagger_ui(app)
    setup_db(app)
    return app

APP = create_app()

''' Default UI Route '''
@APP.route("/")
def hello():
    return render_template('index.html')

@APP.errorhandler(400)
def handle_400_error(_error):
    """Return a http 400 error to client"""
    return make_response(jsonify({'error': 'Misunderstood'}), 400)


@APP.errorhandler(401)
def handle_401_error(_error):
    """Return a http 401 error to client"""
    return make_response(jsonify({'error': 'Unauthorised'}), 401)


@APP.errorhandler(404)
def handle_404_error(_error):
    """Return a http 404 error to client"""
    return make_response(jsonify({'error': 'Not found'}), 404)


@APP.errorhandler(500)
def handle_500_error(_error):
    """Return a http 500 error to client"""
    return make_response(jsonify({'error': 'Server error'}), 500)


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