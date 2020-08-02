
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from os import environ as env

database_name = env.get('DATABASE_NAME', "casting_agency")
database_path = env.get('DATABASE_URI', "postgres://{}@{}/{}?gssencmode=disable".format(
    'postgres', 'localhost:5432', database_name))

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()

def db_drop_and_create_all():
    db.drop_all()
    db.create_all()

'''
  Define Many to Many relationship between movies and actors table
'''
castings = db.Table('castings',
  db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True),
  db.Column('actor_id', db.Integer, db.ForeignKey('actors.id'), primary_key=True)
)

class BaseModel:
  pass

  def insert(self):
      db.session.add(self)
      db.session.commit()

  def update(self):
      db.session.commit()

  def delete(self):
      db.session.delete(self)
      db.session.commit()

class Movie(db.Model, BaseModel):
  pass
  __tablename__ = "movies"

  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String, nullable=False)
  release_date = db.Column(db.Float, nullable=True)

  # relationships
  performing_actors = db.relationship("Actor", secondary=castings, lazy='subquery', backref=db.backref("movies", lazy=True))

  def serialize(self):
    return {
      "id": self.id,
      "title": self.title,
      "release_date": self.release_date
    }

  def serialize_with_actors(self):
    actors = Actor.query.filter(Actor.movies.any(id=self.id)).all()
    return {
      "id": self.id,
      "title": self.title,
      "release_date": self.release_date,
      "actors": [
        actor.serialize() for actor in actors
      ]
    }

class Actor(db.Model, BaseModel):
  pass

  __tablename__ = "actors"

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String, nullable=False)
  age = db.Column(db.Integer)
  gender = db.Column(db.String, default='U')

  def serialize(self):
    return {
      "id": self.id,
      "name": self.name,
      "age": self.age,
      "gender": self.gender
    }

  def serialize_with_movies(self):
    return {
      "id": self.id,
      "name": self.name,
      "age": self.age,
      "gender": self.gender,
      "movies": [
        movie.serialize() for movie in self.movies
      ]
    }

