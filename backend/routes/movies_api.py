from flask import jsonify, abort, request, Blueprint
from backend.models import Movie, Actor
from backend.utils.datetime_utils import isValidDateTimeInSeconds
from backend.auth.auth import requires_auth
import json

API = Blueprint('movies_api', __name__)


def get_blueprint():
    ''' Return Movies API Blueprint'''
    return API


@API.route('', methods=['GET'])
@requires_auth('read:movies')
def get_movies(payload):
    try:
        movies = [
            movie.serialize_with_actors() for movie in Movie.query.all()
        ]
        return jsonify({
            "results": movies,
            "count": len(movies)
        })
    except Exception as e:
        print(e)
        abort(400)


@API.route('/<int:id>', methods=['GET'])
@requires_auth('read:movies')
def get_movie(payload, id):
    try:
        movie = Movie.query.filter(Movie.id == id).one_or_none()

        if movie is None:
            abort(400, 'Invalid movie id')

        return jsonify(movie.serialize_with_actors())
    except Exception as e:
        abort(400, e.description)


@API.route('', methods=['POST'])
@requires_auth('create:movies')
def create_movie(payload):
    try:
        data = json.loads(request.data)
        name = data.get('title', None)
        release_date = data.get('release_date', None)
        actor_ids = data.get('actors', [])

        if (name is None) or (len(name.strip()) == 0):
            abort(400, 'Movie name is not specified.')

        if ((isinstance(release_date, int) is False) or
                (isValidDateTimeInSeconds(release_date) is False)):
            abort(400, 'Invalid release date')

        actors = Actor.query.filter(Actor.id.in_(actor_ids)).all()

        movie = Movie(title=name, release_date=release_date)
        movie.performing_actors = actors

        movie.insert()

        return jsonify(movie.serialize_with_actors())

    except Exception as e:
        print(e)
        abort(500, 'Failed to insert')


@API.route('/<int:id>', methods=['PATCH'])
@requires_auth('update:movies')
def edit_movie(payload, id):
    try:
        movie = Movie.query.filter(Movie.id == id).first()
        if movie is None:
            abort(400, 'Invalid movie id.')

        current_assigned_actors = [
            actor.id for actor in movie.performing_actors
        ]

        data = json.loads(request.data)
        movie.title = data.get('title', movie.title)
        release_date = data.get('release_date', movie.release_date)
        actor_ids = data.get('actors', current_assigned_actors)

        if (isinstance(release_date, int) and
                isValidDateTimeInSeconds(release_date)):
            movie.release_date = release_date

        actors = Actor.query.filter(Actor.id.in_(actor_ids)).all()
        movie.performing_actors = actors

        movie.update()

        return jsonify(movie.serialize_with_actors())

    except Exception as e:
        print(e)
        abort(500, 'Failed to insert')


@API.route('/<int:id>', methods=['DELETE'])
@requires_auth('delete:movies')
def delete_movie(payload, id):
    try:
        movie = Movie.query.filter(Movie.id == id).first()
        if movie is None:
            abort(400, 'Invalid movie id.')

        movie.delete()

        return jsonify({
            "success": True
        })

    except Exception as e:
        print(e)
        abort(500, 'Failed to insert')
