import unittest
from .base_test import BaseTestCase


class MoviesApiTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()

    def tearDown(self):
        super().tearDown()

    def test_get_all_movies(self):
        self.assertEqual(True, True, "Sample Test failed")


if __name__ == "__main___":
    """ Run unittests """
    unittest.main()
