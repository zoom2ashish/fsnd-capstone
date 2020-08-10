from flask import jsonify, abort, request, Blueprint, url_for, redirect, session
from os import environ as env
from authlib.integrations.flask_client import OAuth
from os import environ as env
from six.moves.urllib.parse import urlencode

AUTH0_CALLBACK_URL=env.get('AUTH0_CALLBACK_URL')
AUTH0_CLIENT_ID= env.get('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET=env.get('AUTH0_CLIENT_SECRET')
AUTH0_DOMAIN=env.get('AUTH0_DOMAIN')

API = Blueprint('auth_api', __name__)

class OAuthHelper:
  _auth0 = None

  @property
  def auth0(self):
    return self._auth0

  @auth0.setter
  def auth0(self, value):
    self._auth0 = value

  def setup_oauth(self, app):
    oauth = OAuth(app)
    AUTH0_DOMAIN = env.get('AUTH0_DOMAIN')
    self.auth0 = oauth.register(
        'auth0',
        client_id=AUTH0_CLIENT_ID,
        client_secret=AUTH0_CLIENT_SECRET,
        api_base_url='https://{}'.format(AUTH0_DOMAIN),
        access_token_url='https://{}/oauth/token'.format(AUTH0_DOMAIN),
        authorize_url='https://{}/authorize'.format(AUTH0_DOMAIN),
        client_kwargs={
            'scope': 'openid profile email',
        },
    )

oauthHelper = OAuthHelper()

def get_blueprint():
  ''' Return Auth API Blueprint '''
  return API

@API.route('')
def login():
  return oauthHelper.auth0.authorize_redirect(redirect_uri=AUTH0_CALLBACK_URL)

@API.route('/callback')
def callback_handling():
    # Handles response from token endpoint
    oauthHelper.auth0.authorize_access_token()
    resp = oauthHelper.auth0.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    session['jwt']=oauthHelper.auth0.token.get('id_token')
    session['jwt_payload'] = userinfo
    session['profile'] = {
        'user_id': userinfo['sub'],
        'name': userinfo['name'],
        'picture': userinfo['picture']
    }
    return jsonify({
      "jwt": oauthHelper.auth0.token.get('id_token'),
      "userinfo": session["jwt_payload"],
      "profile": session['profile']
    })
    # return redirect('/')

@API.route('/logout')
def logout():
    # Clear session stored data
    session.clear()
    # Redirect user to logout endpoint
    params = {'returnTo': url_for('index', _external=True), 'client_id': AUTH0_CLIENT_ID}
    return redirect(oauthHelper.auth0.api_base_url + '/v2/logout?' + urlencode(params))