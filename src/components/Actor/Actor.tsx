import React from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";

import { ActorDto, MovieDto, Gender } from "../../dto";
import classes from "./Actor.module.css";
import { getGenderDisplayString } from "../../utils/generic-utils";
import Can from "../../hoc/Can";

export interface ActorProps {
  data: ActorDto;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Actor = (props: React.PropsWithChildren<ActorProps>) => {
  const movies = (props.data.movies || []).map((movie: MovieDto) => (
    <Badge key={movie.id} variant="info" className="mr-2">
      {movie.title}
    </Badge>
  ));

  return (
    <Card className={classes.Actor + " shadow bg-white rounded "}>
      <Card.Body>
        <Card.Title>{props.data?.name}</Card.Title>
        <Card.Text>
          <span className="mr-2">Age</span>
          <span>{props.data.age}</span>
        </Card.Text>
        <Card.Text>
          <span className="mr-2">Gender</span>
          <span>{getGenderDisplayString(props.data.gender)}</span>
        </Card.Text>
        <Card.Text>{movies}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Can permissions={["update:actors"]}>
          <Card.Link href="#" onClick={() => props.onEdit(props.data.id)}>
            Edit
          </Card.Link>
        </Can>
        <Can permissions={["delete:actors"]}>
          <Card.Link href="#" onClick={() => props.onDelete(props.data.id)}>
            Delete
          </Card.Link>
        </Can>
      </Card.Footer>
    </Card>
  );
};

export default Actor;
