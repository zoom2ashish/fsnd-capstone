## Casting Agency App using Python Flask and React
This app is developed as part of capstone project for Udacity's FullStack Developer Nanodegree. It allows managing movies, actors and their association based on RBAC permissions assiged to logged in user.

### System Requirement
- Node JS
- Python 3
- Postgres SQL
- Auth0.com authentication

### Authentication Platform
Currently the [Auth0.com] is supported for authentication and RBAC authorization. Create
auth0 account and setup Single-Page app with configuration to allow authentication from your deployed URL. Also, setup desired Users and Roles with following permissions:
#### Permissions
| Permission  | Description  |
|---|---|
| read:actors  | Allows reading actor(s) records |
| create:actors | Allow creating actor's record |
| update:actors | Allow editing actor's record |
| delete:actors | Allow deleting actor's record |
| read:movies   | Allow reading movie records |
| create:movies | Allow creating actor's record |
| update:movies | Allow updating actor's record |
| delete:movies | Allow deleting actor's record |

### Setup Environment Variables
Required Enviroment variables is specified in .evn.template file

```
DATABASE_NAME=
DATABASE_URL=postgres://postgres@localhost:5432/casting_agency?gssencmode=disable
APP_SECRET_KEY=some-secret-key
AUTH0_API_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_DOMAIN=
AUTH0_CALLBACK_URL=http://localhost:5000/api/auth/callback
```

### Creating database
First create database in Postgres SQL
```bash
createdb casting_agency -U <username>
python manage.py db upgrade
```
### To Setup and Start Backend
```bash
pip install -r requirements.txt
python app.py
```

### Start Frontend separately
```bash
npm install
npm run start
```

## Swagger UI for API Documentation
Hosted Locally
http://127.0.0.1:5000/swagger/

###
Hosted via Heroku
https://ashishp-casting-agency.herokuapp.com/swagger

## Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](
    https://heroku.com/deploy?template=https://github.com/zoom2ashish/fsnd-capstone)

You can also test this api on heroku.

Live : https://ashishp-casting-agency.herokuapp.com/swagger

