
import os
from dotenv import load_dotenv

load_dotenv()

assistant_jwt_token = os.getenv('TEST_ASSISTANT_TOKEN')
director_jwt_token = os.getenv('TEST_DIRECTOR_TOKEN')
producer_jwt_token = os.getenv('TEST_PRODUCTER_TOKEN')
