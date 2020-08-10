import './App.css';

import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Actors from './containers/Actors/Actors';
import Layout from './containers/Layout/Layout';
import Movies from './containers/Movies/Movies';
import Home from './containers/Home/Home';
import { useAuth0 } from '@auth0/auth0-react';
import axios from './services/axios';

function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>('');
  useEffect(() => {

    (async() => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        setToken(token);
      }
    })();
  }, [isAuthenticated])

  const routes = isAuthenticated && token ? (
    <>
    <Switch>
      <Route path="/movies" component={Movies}></Route>
      <Route exact path="/actors" component={Actors}></Route>
      <Redirect to="/movies"></Redirect>
    </Switch>
    </>
  ) : <Home />;

  return (
    <Layout >
      {routes}
    </Layout>
  );
}

export default App;
