import React, { useState, useEffect } from 'react';
import { NavLink, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import classes from './Layout.module.css';
import { useAuth0, IdToken } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

const Layout = (props: React.PropsWithChildren<RouteComponentProps>) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

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
        <NavDropdown.Item onClick={() => logout({returnTo: window.location.origin, client_id: 'IrrwsvDC9WQZ404zksQ0ALJsbKGZwX4m' })}>Logout</NavDropdown.Item>
      </NavDropdown>
    </>) : <Button onClick={() => loginWithRedirect()} variant="dark">Log In</Button>

  return (
    <Container fluid>
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