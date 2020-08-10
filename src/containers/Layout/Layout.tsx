import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import classes from './Layout.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

const Layout = (props: React.Props<any>) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navLinks = isAuthenticated ? (
  <>
    <NavLink to="/movies" className="nav-link" activeClassName={'active'}>Movies</NavLink>
    <NavLink to="/actors" className="nav-link" activeClassName={'active'}>Actors</NavLink>
   </>
   ) : null;

  const signInControls = isAuthenticated ?
    <Button onClick={() => logout({returnTo: window.location.origin, client_id: 'IrrwsvDC9WQZ404zksQ0ALJsbKGZwX4m' })} variant="link">Logout</Button> :
    <Button onClick={() => loginWithRedirect()} variant="link">Log In</Button>

  return (
    <Container>
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

export default Layout;