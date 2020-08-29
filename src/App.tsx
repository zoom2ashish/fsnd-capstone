import './App.css';

import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Actors from './containers/Actors/Actors';
import Home from './containers/Home/Home';
import Layout from './containers/Layout/Layout';
import Movies from './containers/Movies/Movies';
import UserProfile from './containers/UserProfile/UserProfile';
import { AuthContext } from './context/auth-context';

function App() {
  const { isAuthenticated, token } = useContext(AuthContext);
  const routes = isAuthenticated && token ? (
    <>
    <Switch>
      <Route exact path="/movies" component={Movies}></Route>
      <Route exact path="/actors" component={Actors}></Route>
      <Route exact path="/userprofile" component={UserProfile}></Route>
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