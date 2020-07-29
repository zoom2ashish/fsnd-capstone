import uuid
from datetime import datetime, timedelta
from flask import jsonify, abort, request, Blueprint
from models import Movie
import json
import math

API = Blueprint('movies_api', __name__)

def get_blueprint():
  ''' Return Movies API Blueprint'''
  return API

@API.route('/', methods=['GET'])
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

@API.route('/', methods=['POST'])
def create_movie():
  try:
    data = json.loads(request.data)
    name = data['name']
    release_date = data['release_date']

    if (name is None) or (len(name.strip()) == 0):
      abort(400, 'Movie name is not specified.')

    movie = Movie(name=name, release_date=release_date)
    movie.insert()

  except Exception:
    abort(500, 'Failed to insert')
