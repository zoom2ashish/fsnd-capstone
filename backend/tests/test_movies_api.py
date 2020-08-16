import json
import unittest
from datetime import datetime
import backend.tests.jwt_tokens as tokens
from .base_test import BaseTestCase
from backend.models import Actor, Movie


class MoviesApiTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.mock_actor = Actor(
            name="Test Actor",
            age=50,
            gender='M'
        )
        self.mock_movie = Movie(
            title="Test Movie",
            release_date=1597277251,
            performing_actors=[self.mock_actor]
        )

    def tearDown(self):
        super().tearDown()

    def test_get_all_movies_empty_database(self):
        response = self.client.get(
            '/api/movies',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 0)

    def test_get_all_movies_with_records(self):
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.get(
            '/api/movies',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)

    def test_get_all_movies_rbac_check(self):
        self.mock_movie.insert()

        response = self.client.get('/api/movies')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data['success'], False)

        response = self.client.get(
            '/api/movies',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)

        response = self.client.get(
            '/api/movies',
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)

        response = self.client.get(
            '/api/movies',
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)

    """ Verify GET /api/movies/<movie_id> endpoint """

    def test_get_movie_by_id_empty_database(self):
        response = self.client.get(
            '/api/movies/0',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['success'], False)

    def test_get_movie_by_id(self):
        """ Insert records first """
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.get(
            f'/api/movies/{self.mock_movie.id}',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["id"], self.mock_movie.id)
        self.assertEqual(data["title"], self.mock_movie.title)

    """ Verify POST /api/movies endpoint """

    def test_create_movies_invalid_payload(self):
        payload = {
            "release_date": round(datetime.now().timestamp())
        }

        response = self.client.post(
            '/api/movies', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])

    def test_create_movies_valid_payload(self):
        payload = self.mock_movie.serialize()

        response = self.client.post(
            '/api/movies', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])
        self.assertEqual(data["title"], self.mock_movie.title)

    def test_create_movies_rbac_check(self):
        payload = self.mock_movie.serialize()

        response = self.client.post(
            '/api/movies', json=payload,
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.post(
            '/api/movies', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.post(
            '/api/movies', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

    """ Verify PATCH /api/movies/<movie_id> endpoint """

    def test_edit_movie_invalid_movie_id(self):
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.patch(
            '/api/movies/99999', json={},
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertFalse(data['success'])

    def test_edit_movie_valid_payload(self):
        self.mock_movie.insert()

        payload = {
            "title": "Updated Movie Title"
        }

        response = self.client.patch(
            f'/api/movies/{self.mock_movie.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])
        self.assertEqual(data["title"], payload["title"])

    def test_edit_movie_rbac_check(self):
        self.mock_movie.insert()
        payload = {
            "title": "Update Movie Title",
            "age": round(datetime.now().timestamp())
        }

        response = self.client.patch(
            f'/api/movies/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.patch(
            f'/api/movies/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

        response = self.client.patch(
            f'/api/movies/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

    """ Verify DELETE /api/movies/<movie_id> endpoint """

    def test_delete_movie_invalid_movie_id(self):
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.delete(
            '/api/movies/99999', json={},
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])

    def test_delete_movie_valid_id(self):
        self.mock_movie.insert()

        response = self.client.delete(
            f'/api/movies/{self.mock_movie.id}',
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])

    def test_delete_movie_rbac_check(self):
        self.mock_movie.insert()

        response = self.client.delete(
            f'/api/movies/{self.mock_movie.id}',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.delete(
            f'/api/movies/{self.mock_movie.id}',
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.delete(
            f'/api/movies/{self.mock_movie.id}',
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])


if __name__ == "__main___":
    """ Run unittests """
    unittest.main()
