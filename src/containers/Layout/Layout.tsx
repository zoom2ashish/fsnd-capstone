import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import classes from './Layout.module.css';
import { useAuth0, IdToken } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../context/auth-context';

const Layout = (props: React.PropsWithChildren<RouteComponentProps>) => {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);

  const userProfileClicked = () => {
    props.history.push('/userprofile');
  }

  const navLinks = isAuthenticated ? (
  <>
    <NavLink to="/movies" className="nav-link" activeClassName={'active'}>Movies</NavLink>
    <NavLink to="/actors" className="nav-link" activeClassName={'active'}>Actors</NavLink>
   </>
   ) : null;

  const signInControls = isAuthenticated ?
    (<>
      <NavDropdown title={user ? user.name : 'Unknown' } id="collasible-nav-dropdown">
        <NavDropdown.Item onClick={() => userProfileClicked()}>View Profile</NavDropdown.Item>
        <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
      </NavDropdown>
    </>) : <Button onClick={() => login()} variant="dark">Log In</Button>

  return (
    <Container className={classes.Layout + ' ' + 'shadow'}>
      <Navbar bg="dark"  variant="dark">
        <Navbar.Brand href="#home">Casting Agency</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {navLinks}
          </Nav>
          <Nav>
            { signInControls }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className={'container-fluid pt-4'}>
        {props.children}
      </div>
    </Container>
  );
};

export default withRouter(Layout);