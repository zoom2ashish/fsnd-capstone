import React from "react";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from "react-bootstrap/Badge";
import { MovieDto, ActorDto } from "../../dto";
import classes from "./Movie.module.css";
import { Link, NavLink } from 'react-router-dom';
import { getDate } from '../../utils/dateutils';

export interface MovieProps {
  data: MovieDto;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Movie = (props: React.PropsWithChildren<MovieProps>) => {
  const actors = (props.data.actors || []).map((actor: ActorDto) => (
    <Badge key={actor.id} variant="info" className="mr-2">{actor.name}</Badge>
  ));

  const releaseDate = (
    <span className={[classes.Release_Date, "pt-1"].join(" ")}>
      Release Date: {getDate(props.data.release_date)}
    </span>
  );

  return (
      <Card className={classes.Movie}>
        <Card.Body>
          <Card.Title>{props.data?.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {releaseDate}
          </Card.Subtitle>
          <Card.Text>
            {actors}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Card.Link href="#" onClick={() => props.onEdit(props.data.id)}>Edit</Card.Link>
          <Card.Link href="#" onClick={() => props.onDelete(props.data.id)}>Delete</Card.Link>
        </Card.Footer>
      </Card>
  );
};

export default Movie;
