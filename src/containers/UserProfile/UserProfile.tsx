import React from 'react';
import { WithAuth0Props, withAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const UserProfile = (props: React.PropsWithRef<WithAuth0Props & RouteComponentProps>) => {
  const { isAuthenticated, user } = props.auth0;

  let userProfile = null;
  if (isAuthenticated && user) {
    userProfile= (
      <Container>
        <Row>
          <Col sm={3} md={2}>Name</Col>
          <Col>{user.name}</Col>
        </Row>
        <Row className="mt-3">
          <Col sm={3} md={2}>Email</Col>
          <Col>{user.email || 'Not Set'}</Col>
        </Row>
        <Row className="mt-3">
          <Col sm={3} md={2}>Nickname</Col>
          <Col>{user.nickname || 'Not Set'}</Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      { userProfile }
    </>
  );
};

export default withRouter(withAuth0(UserProfile));