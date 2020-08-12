"""Database Migration Scripts"""

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import APP
from backend.models import db

migrate = Migrate(APP, db)
manager = Manager(APP)

manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    db.drop_all()
    manager.run()
