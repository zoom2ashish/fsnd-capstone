import React, { useEffect, useState } from 'react';
import { WithAuth0Props, withAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import classes from './UserProfile.module.css';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ClipboardPlus } from 'react-bootstrap-icons';
import Alert from 'react-bootstrap/esm/Alert';

const UserProfile = (props: React.PropsWithRef<WithAuth0Props & RouteComponentProps>) => {
  const { isAuthenticated, user, getAccessTokenSilently } = props.auth0;
  const [token, setToken] = useState<string>('');
  const [ copied, setCopied ] = useState<boolean>(false);
  let resetCopiedFlagTimer = 0;

  useEffect(() => {
    (async() => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        setToken(token);
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently]);

  const markAsCopied = () => {
    clearTimeout(resetCopiedFlagTimer);
    setCopied(true);
    resetCopiedFlagTimer = setTimeout(() => {
      setCopied(false);
      clearTimeout(resetCopiedFlagTimer);
    }, 3000) as any;
  }

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
        <Row className="mt-3">
          <Col sm={3} md={2}>JWT Token</Col>
          <Col>
            <div className={classes.Token}>{ token }</div>
            <div className={classes.copyAction}>
            <CopyToClipboard text={token}
              onCopy={() => markAsCopied()}>
              <ClipboardPlus className={classes.copyIcon} size={24} color={copied ? 'green' : 'blue'}></ClipboardPlus>
            </CopyToClipboard>
            { copied ?
              <Alert className={classes.copiedAlert} variant="success">Copied To Clipboard</Alert>
             : null }
             </div>
          </Col>
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