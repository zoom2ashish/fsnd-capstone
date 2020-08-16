
import unittest
import os
from backend import create_app
from backend.models import db, db_create_all, db_drop_all
from config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('APP_SECRET_KEY')


class BaseTestCase(unittest.TestCase):

    def setUp(self):
        super().setUp()
        """ Create app and setup database """
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        db.session.close()
        db_drop_all()
        db_create_all()

    def tearDown(self):
        """ Teaddown database tables after every testcase """
        db.session.close()
        db_drop_all()
        self.app_context.pop()
        return super().tearDown()
