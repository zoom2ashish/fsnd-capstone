import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FocusTrap from 'react-focus-trap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Select, { ValueType } from 'react-select';

import { ActorListResultDto, MovieDto, MoviePostRequestDto } from '../../dto';

export interface MovieFormProps {
  show: boolean;
  data?: MovieDto;
  onClose: () => void;
}

type OptionType = {
  value: number;
  label: string;
};

const MovieForm = (
  props: React.PropsWithChildren<MovieFormProps> & RouteComponentProps
) => {
  const movie = props.data || null;
  const initialSelectedActors = (
    (movie && movie.actors) ||
    []
  ).map((actor) => ({ value: actor.id, label: actor.name }));
  const [title, setTitle] = useState<string>((movie && movie.title) || "");
  const [allActors, setAllActors] = useState<OptionType[]>(
    initialSelectedActors
  );
  const [selectedActors, setSelectedActors] = useState<OptionType[]>(
    initialSelectedActors
  );

  useEffect(() => {
    fetch("/api/actors")
      .then((response) => response.json())
      .then((response: ActorListResultDto) => {
        const actorOptions: OptionType[] = response.results.map((actor) => ({
          value: actor.id,
          label: actor.name,
        }));
        setAllActors(actorOptions);
      });
  }, []);

  const handleActorSelectionChange = (
    selectedOptions: ValueType<OptionType>
  ) => {
    console.log("selectedOptions=", selectedOptions);
    setSelectedActors(selectedOptions as OptionType[]);
  };

  const onSubmit = () => {
    const updatedMovie: MoviePostRequestDto = {
      title: title,
      release_date: 0,
      actors: (selectedActors || []).map((actor: OptionType) => actor.value),
    };

    props.onClose();
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <FocusTrap active={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="moveiForm.title">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                placeholder="Enter Movie Title"
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="movieForm.actors">
              <Form.Label>Actors</Form.Label>
              <Select
                isMulti
                value={selectedActors as ValueType<OptionType>}
                onChange={handleActorSelectionChange}
                options={allActors}
              />
            </Form.Group>
            <Form.Group controlId="movieForm.description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </FocusTrap>
    </Modal>
  );
};

export default withRouter(MovieForm);
