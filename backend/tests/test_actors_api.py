import json
import unittest
import backend.tests.jwt_tokens as tokens
from .base_test import BaseTestCase
from backend.models import Actor, Movie


class ActorsApiTestCase(BaseTestCase):

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

    def test_get_index_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "text/html")

    """ Verify GET /api/actors endpoint """

    def test_get_all_actors_wihtout_token(self):
        response = self.client.get('/api/actors')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(data['success'], False)

    def test_get_all_actors_empty_database(self):
        response = self.client.get(
            '/api/actors',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 0)
        self.assertEqual(len(data['results']), 0)

    def test_get_all_actors_returns_actors(self):
        self.mock_actor.insert()
        self.mock_movie.insert()
        response = self.client.get(
            '/api/actors',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)

    def test_get_all_actors_rbac_check(self):
        response = self.client.get('/api/actors')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data['success'], False)

        response = self.client.get(
            '/api/actors',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            '/api/actors',
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            '/api/actors',
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)

    """ Verify GET /api/actors/<actor_id> endpoint """

    def test_get_actor_by_id_empty_database(self):
        response = self.client.get(
            '/api/actors/0',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['success'], False)

    def test_get_actor_by_id(self):
        """ Insert records first """
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.get(
            f'/api/actors/{self.mock_actor.id}',
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["id"], self.mock_actor.id)
        self.assertEqual(data["name"], self.mock_actor.name)

    """ Verify POST /api/actors endpoint """

    def test_create_actor_invalid_payload(self):
        payload = {
            "name": "",
            "age": 0,
            "gender": "U"
        }

        response = self.client.post(
            '/api/actors', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])

    def test_create_actor_valid_payload(self):
        payload = self.mock_actor.serialize()

        response = self.client.post(
            '/api/actors', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])
        self.assertEqual(data["name"], self.mock_actor.name)

    def test_create_actor_rbac_check(self):
        payload = self.mock_actor.serialize()

        response = self.client.post(
            '/api/actors', json=payload,
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.post(
            '/api/actors', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

        response = self.client.post(
            '/api/actors', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

    """ Verify PATCH /api/actors/<actor_id> endpoint """

    def test_edit_actor_invalid_actor_id(self):
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.patch(
            '/api/actors/99999', json={},
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertFalse(data['success'])

    def test_edit_actor_valid_payload(self):
        self.mock_actor.insert()

        payload = {
            "name": "Updated Actor Name"
        }

        response = self.client.patch(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])
        self.assertEqual(data["name"], payload["name"])

    def test_edit_actor_rbac_check(self):
        self.mock_actor.insert()
        payload = {
            "name": "Update Actor Name",
            "age": 99
        }

        response = self.client.patch(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.patch(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

        response = self.client.patch(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["id"])

    """ Verify DELETE /api/actors/<actor_id> endpoint """

    def test_delete_actor_invalid_actor_id(self):
        self.mock_actor.insert()
        self.mock_movie.insert()

        response = self.client.delete(
            '/api/actors/99999', json={},
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])

    def test_delete_actor_valid_id(self):
        self.mock_actor.insert()

        response = self.client.delete(
            f'/api/actors/{self.mock_actor.id}',
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])

    def test_delete_actor_rbac_check(self):
        self.mock_actor.insert()
        payload = {
            "name": "Update Actor Name",
            "age": 99
        }

        response = self.client.delete(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.assistant_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(data["success"])

        response = self.client.delete(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.director_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])

        response = self.client.delete(
            f'/api/actors/{self.mock_actor.id}', json=payload,
            headers={'Authorization': f'Bearer {tokens.producer_jwt_token}'}
            )
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data["success"])


if __name__ == "__main___":
    """ Run unittests """
    unittest.main()
