# Install Dependecies
echo "START: Install python packages"
pip3 install -r requirements.txt
echo "END: Install python packages"
echo "============================="
# Setup Environment Variables
echo "START: Setting up environment variables"
echo on
export DATABASE_NAME=casting_agency
export DATABASE_URL=postgres://postgres@localhost:5432/casting_agency?gssencmode=disable
export APP_SECRET_KEY=some-secret-key
export AUTH0_API_AUDIENCE=casting-agency-api
export AUTH0_CLIENT_ID=
export AUTH0_CLIENT_SECRET=
export AUTH0_DOMAIN=
export AUTH0_CALLBACK_URL=http://localhost:5000/api/auth/callback
export TEST_DATABASE_URL=postgres://postgres@localhost:5432/test_casting_agency?gssencmode=disable
export TEST_ASSISTANT_TOKEN=
export TEST_DIRECTOR_TOKEN=
export TEST_PRODUCTER_TOKEN=
echo "END: Setting up environment variables"
echo "============================="

# Execute Test cases
echo "START: Running Unit Tests"
pytest
echo "END: Running Unit Tests"
echo "============================="



