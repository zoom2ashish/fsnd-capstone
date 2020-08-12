from flask import jsonify, abort, request, Blueprint
from enum import Enum
from backend.models import Actor, Movie
from backend.auth.auth import requires_auth
import json


class Gender(Enum):
    Male = 'M'
    Female = 'F'
    Unknown = 'U'


API = Blueprint('actors_api', __name__)


def get_blueprint():
    ''' Return Actors API Blueprint '''
    return API


@API.route('', methods=['GET'])
@requires_auth('read:actors')
def get_actors(payload):
    try:
        actors = [
            actor.serialize_with_movies() for actor in Actor.query.all()
        ]

        return jsonify({
            "results": actors,
            "count": len(actors)
        })
    except Exception as e:
        print(e)
        abort(400)


@API.route('/<int:id>', methods=['GET'])
@requires_auth('read:actors')
def get_actor(payload, id):
    try:
        actor = Actor.query.filter(Actor.id == id).one_or_none()

        if actor is None:
            abort(400, 'Invalid actor id')

        return jsonify(actor.serialize())
    except Exception:
        abort(400)


@API.route('', methods=['POST'])
@requires_auth('create:actors')
def create_actor(payload):
    try:
        data = json.loads(request.data)
        name = data['name']
        age = data['age']
        gender = Gender(data['gender'])
        movie_ids = data.get('movies', [])

        if (name is None) or (len(name.strip()) == 0):
            abort(400, 'Actor name is not specified.')

        if ((isinstance(age, int) is False) or age <= 0 or age > 100):
            abort(400, 'Invalid age')

        if (isinstance(gender, Gender) is False):
            abort(400, 'Invalid gender')

        movies = Movie.query.filter(Movie.id.in_(movie_ids)).all()

        actor = Actor(name=name, age=age, gender=gender.value)
        actor.movies = movies

        actor.insert()

        return jsonify(actor.serialize())

    except Exception as e:
        print(e)
        abort(500, f'Failed to insert. {e.description}')


@API.route('/<int:id>', methods=['PATCH'])
@requires_auth('update:actors')
def edit_actor(payload, id):
    try:
        actor = Actor.query.filter(Actor.id == id).one_or_none()
        if (actor is None):
            abort(400, 'Invalid actor id')

        data = json.loads(request.data)
        name = data.get('name', actor.name)
        age = data.get('age', actor.age)
        gender = Gender(data.get('gender', actor.gender))
        movie_ids = data.get('movies', [])

        movies = Movie.query.filter(Movie.id.in_(movie_ids)).all()

        actor.name = name
        actor.age = age
        actor.gender = gender.value
        actor.movies = movies

        actor.update()

        return jsonify(actor.serialize())

    except Exception as e:
        print(e)
        abort(500, f'Failed to insert. {e.description}')


@API.route('/<int:id>', methods=['DELETE'])
@requires_auth('delete:actors')
def delete_actor(payload, id):
    try:
        actor = Actor.query.filter(Actor.id == id).first()
        if actor is None:
            abort(400, 'Invalid actor id.')

        actor.delete()

        return jsonify({
            "success": True
        })

    except Exception as e:
        print(e)
        abort(500, 'Failed to delete record.')
