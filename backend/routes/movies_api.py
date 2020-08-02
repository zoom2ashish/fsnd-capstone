import uuid
from datetime import datetime, timedelta
from flask import jsonify, abort, request, Blueprint
from backend.models import Movie
from backend.utils.datetime_utils import isValidDateTime
import json
import math

API = Blueprint('movies_api', __name__)

def get_blueprint():
  ''' Return Movies API Blueprint'''
  return API

@API.route('', methods=['GET'])
def get_movies():
  try:
    allMovies = Movie.query.all()
    movies = [
      movie.serialize_with_actors() for movie in Movie.query.all()
    ]
    return jsonify({
      "results": movies,
      "count": len(movies)
    })
  except Exception:
    abort(400)

@API.route('/<int:id>', methods=['GET'])
def get_movie(id):
  try:
    movie = Movie.query.filter(Movie.id==id).one_or_none()

    if movie is None:
      abort(400, 'Invalid movie id')

    return jsonify(movie.serialize_with_actors())
  except Exception as e:
    abort(400, e.description)

@API.route('', methods=['POST'])
def create_movie():
  try:
    data = json.loads(request.data)
    name = data['title']
    release_date = data['release_date']

    if (name is None) or (len(name.strip()) == 0):
      abort(400, 'Movie name is not specified.')

    if ( (isinstance(release_date, int) is False) or (isValidDateTime(release_date) is False)):
      abort(400, 'Invalid release date')

    movie = Movie(title=name, release_date=release_date)
    movie.insert()

    return jsonify(movie.serialize())

  except Exception as e:
    print(e)
    abort(500, 'Failed to insert')

@API.route('/<int:id>', methods=['PATCH'])
def edit_movie(id):
  try:
    movie = Movie.query.filter(Movie.id==id).first()
    if movie is None:
      abort(400, 'Invalid movie id.')

    data = json.loads(request.data)
    title = data['title']
    release_date = data['release_date']

    if (title is not None) and (len(title.strip()) > 0):
      movie.title = title

    if (isinstance(release_date, int) and isValidDateTime(release_date)):
      movie.release_date = release_date

    movie.update()

    return jsonify(movie.serialize())

  except Exception as e:
    print(e)
    abort(500, 'Failed to insert')

@API.route('/<int:id>', methods=['DELETE'])
def delete_movie(id):
  try:
    movie = Movie.query.filter(Movie.id==id).first()
    if movie is None:
      abort(400, 'Invalid movie id.')

    movie.delete()

    return jsonify({
      "success": True
    })

  except Exception as e:
    print(e)
    abort(500, 'Failed to insert')