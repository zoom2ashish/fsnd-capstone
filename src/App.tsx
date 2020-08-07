import './App.css';

import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Actors from './containers/Actors/Actors';
import Layout from './containers/Layout/Layout';
import Movies from './containers/Movies/Movies';

function App() {
  let routes = (
    <Switch>
      <Route path="/movies" component={Movies}></Route>
      <Route exact path="/actors" component={Actors}></Route>
      <Redirect to="/movies"></Redirect>
    </Switch>
  );

  return (
    <Layout>
      {routes}
    </Layout>
  );
}

export default App;
