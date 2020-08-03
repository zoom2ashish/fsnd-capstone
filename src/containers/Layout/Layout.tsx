import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import classes from './Layout.module.css';

const Layout = (props: React.Props<any>) => {
  return (
    <Container>
      <Navbar bg="dark"  variant="dark">
        <Navbar.Brand href="#home">Casting Agency</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/movies" className="nav-link" activeClassName={'active'}>Movies</NavLink>
            <NavLink to="/actors" className="nav-link" activeClassName={'active'}>Actors</NavLink>
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