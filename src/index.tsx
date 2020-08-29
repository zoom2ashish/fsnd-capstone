import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import AuthContextProvider from './context/auth-context';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="ashishp-dev.us.auth0.com"
      clientId="IrrwsvDC9WQZ404zksQ0ALJsbKGZwX4m"
      audience="casting-agency-api"
      redirectUri={window.location.origin}
    >
      <AuthContextProvider>
        <BrowserRouter basename="/">
          <App />{" "}
        </BrowserRouter>
      </AuthContextProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
