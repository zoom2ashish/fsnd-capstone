import React from 'react';
import {withRouter, Switch, Redirect, Route} from 'react-router-dom';
import Movies from './containers/Movies/Movies';
import './App.css';
import Layout from './containers/Layout/Layout';
import Actors from './containers/Actors/Actors';

function App() {
  let routes = (
    <Switch>
      <Route exact path="/movies" component={Movies}></Route>
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
