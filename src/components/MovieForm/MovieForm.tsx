import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FocusTrap from 'react-focus-trap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Select, { ValueType } from 'react-select';
import DatePicker from 'react-datepicker';
import { ActorListResultDto, MovieDto, MoviePostRequestDto } from '../../dto';
import "react-datepicker/dist/react-datepicker.css";
import Alert from 'react-bootstrap/Alert';
import { createMovie, updateMovie } from '../../services/axios-movies';
import { fetchActors } from '../../services/axios-actors';

export interface MovieFormProps {
  show: boolean;
  isEditing?: boolean;
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
  const initialReleaseDate = (movie && movie.release_date) ? new Date(movie.release_date * 1000) : new Date(); // "release_date" in seconds, whereas Date expects milliseconds
  const initialSelectedActors = (
    (movie && movie.actors) ||
    []
  ).map((actor) => ({ value: actor.id, label: actor.name }));

  const [error, setError] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<Date>(initialReleaseDate)
  const [title, setTitle] = useState<string>((movie && movie.title) || "");
  const [allActors, setAllActors] = useState<OptionType[]>(
    initialSelectedActors
  );
  const [selectedActors, setSelectedActors] = useState<OptionType[]>(
    initialSelectedActors
  );

  useEffect(() => {
    fetchActors().then((response: ActorListResultDto) => {
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
    setSelectedActors(selectedOptions as OptionType[]);
  };

  const onSubmit = () => {
    setError('');
    const updatedMovie: MoviePostRequestDto = {
      title: title,
      release_date: Math.round(releaseDate.getTime() / 1000), // Time in seconds
      actors: (selectedActors || []).map((actor: OptionType) => actor.value),
    };
    const id = movie?.id || 0;
    if (props.isEditing) {
      updateMovie(id, updatedMovie)
        .then(() => {
          props.onClose();
        })
        .catch((e) =>{
          setError('Failed to update movie.' + e.message);
        });
    } else {
      createMovie(updatedMovie)
        .then(() => {
          props.onClose();
        })
        .catch((e) =>{
          setError('Failed to update movie.' + e.message);
        });
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <FocusTrap active={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>{props.isEditing ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { error ? <Alert variant={'danger'}>{error}</Alert> : null }
          <Form>
            <Form.Group controlId="movieForm.title">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                placeholder="Enter Movie Title"
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="movieForm.release_date">
              <Form.Label>Movie Title</Form.Label>
              <DatePicker
                selected={releaseDate}
                onChange={(selectedDate: Date) => setReleaseDate(selectedDate)}
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
