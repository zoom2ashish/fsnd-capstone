import React, { useContext } from 'react';
import classes from './Home.module.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../context/auth-context';

const Home = (props: React.PropsWithChildren<any>) => {
  const { login } = useContext(AuthContext);

  return (
    <div className={classes.HomeImageContainer}>
      <div className={classes.headerTextContainer}>
        <h1 className={classes.HeadingPrimary}>
            <span className={classes.HeadingPrimaryMain}>Casting Agency</span>
            <span className={classes.HeadingPrimarySub}>Way to path forward</span>
        </h1>
        <Button variant="light" className={classes.LoginButton} onClick={() => login()}>Login</Button>
      </div>
    </div>
  );
};

export default Home;