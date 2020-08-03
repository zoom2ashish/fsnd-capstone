import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from "react-bootstrap/Badge";
import classes from './Actor.module.css';
import { ActorDto } from '../../dto';

export interface ActorProps {
  data: ActorDto;
}

const Actor = (props: React.PropsWithChildren<ActorProps>) => {

  const cssClasses = [ classes.Actor, 'mb-4' ].join(' ');
  return (
<Card className={cssClasses}>
      <Card.Body>
        <Row>
          <Col sm={8}>
            <h4>{props.data?.name}</h4>
            <h6>Age: {props.data?.age} yrs</h6>
          </Col>
          <Col sm={4} className="justify-content-end">
            <div className={classes.ActionButtons}>
              <Button variant="primary" className="ml-1">Edit</Button>
              <Button variant="danger" className="ml-1">Delete</Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Actor;