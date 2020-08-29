import React, { PropsWithChildren, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from '../services/authenticated-axios';
import { User } from '@auth0/auth0-react/dist/auth-state';

export interface IAuthContext {
  isAuthenticated: boolean,
  token: string,
  user: User,
  login: () => void,
  logout: () => void
}

export const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
  token: '',
  user: {} as any,
  login: () => {},
  logout: () => {}
});

const AuthContextProvider = (props: PropsWithChildren<any>) => {
  const { isLoading, user, isAuthenticated, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
  const [token, setToken] = useState('');

  useEffect(() => {
    (async() => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        setToken(token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently])

  const loginHandler = () => {
    loginWithRedirect();
  };

  const logoutHandler = () => {
    logout({returnTo: window.location.origin, client_id: 'IrrwsvDC9WQZ404zksQ0ALJsbKGZwX4m' });
  };

  return (
      <AuthContext.Provider value={{ isAuthenticated: isAuthenticated && !!token, token, user, login: loginHandler, logout: logoutHandler }}>
        {isLoading ? <p>Loading...</p> : props.children}
      </AuthContext.Provider>
  );
};

export default AuthContextProvider;