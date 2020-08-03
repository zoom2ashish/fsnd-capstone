import React from "react";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from "react-bootstrap/Badge";
import { MovieDto, ActorDto } from "../../dto";
import classes from "./Movie.module.css";

export interface MovieProps {
  data: MovieDto;
}

const Movie = (props: React.PropsWithChildren<MovieProps>) => {
  const getDate = (timestamp: number = 0) => {
    if (!isNaN(timestamp) && timestamp > 0) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      return "N/A";
    }
  };

  const actors = (props.data.actors || []).map((actor: ActorDto) => (
    <Badge key={actor.id} variant="info">{actor.name}</Badge>
  ));

  const cssClasses = [classes.Movie, "mb-4"].join(" ");
  return (
    <Card className={cssClasses}>
      <Card.Body>
        <Row>
          <Col sm={8}>
            <h4>{props.data?.title}</h4>
            <h6>Actors: {actors}</h6>
            <span className={[classes.Release_Date, "pt-1"].join(" ")}>
              Release Date: {getDate(props.data.release_date)}
            </span>
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

export default Movie;
