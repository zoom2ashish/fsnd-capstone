import 'react-datepicker/dist/react-datepicker.css';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FocusTrap from 'react-focus-trap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Select, { ValueType } from 'react-select';

import { ActorDto, ActorListResultDto, ActorPostRequestDto, Gender, MovieDto, MovieListResultDto } from '../../dto';
import { getGenderDisplayString } from '../../utils/generic-utils';
import { fetchMovies } from '../../services/axios-movies';
import Alert from 'react-bootstrap/Alert';
import { createActor, updateActor } from '../../services/axios-actors';

export interface ActorFormProps {
  show: boolean;
  isEditing?: boolean;
  data?: ActorDto;
  onClose: () => void;
}

type OptionType = {
  value: number;
  label: string;
};

const ActorForm = (
  props: React.PropsWithChildren<ActorFormProps> & RouteComponentProps
) => {
  const actor = props.data || null;
  const initialAge = (actor && actor.age) || 0;
  const initialGender = (actor && actor.gender) || Gender.Unknown;
  const initialSelectedMovies = ((actor && actor.movies) || []).map((movie) => ({ value: movie.id, label: movie.title }));

  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>((actor && actor.name) || "");
  const [age, setAge] = useState<number>(initialAge);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [allMovies, setAllMovies] = useState<OptionType[]>(initialSelectedMovies);
  const [selectedMovies, setSelectedMovies] = useState<OptionType[]>(initialSelectedMovies);

  useEffect(() => {
    fetchMovies()
      .then((response: MovieListResultDto) => {
        const movieOptions: OptionType[] = response.results.map((movie) => ({
          value: movie.id,
          label: movie.title,
        }));
        setAllMovies(movieOptions);
      });
  }, []);

  const handleMovieSelectionChange = (
    selectedOptions: ValueType<OptionType>
  ) => {
    console.log("selectedOptions=", selectedOptions);
    setSelectedMovies(selectedOptions as OptionType[]);
  };

  const onSubmit = () => {
    const updatedActor: ActorPostRequestDto = {
      name: name,
      age: age, // Time in seconds
      gender: gender,
      movies: (selectedMovies || []).map((movie: OptionType) => movie.value),
    };

    const id = actor?.id || 0;
    if (props.isEditing) {
      updateActor(id, updatedActor)
        .then(() => {
          props.onClose();
        })
        .catch((e) =>{
          setError('Failed to update actor.' + e.message);
        });
    } else {
      createActor(updatedActor)
        .then(() => {
          props.onClose();
        })
        .catch((e) =>{
          setError('Failed to update actor.' + e.message);
        });
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <FocusTrap active={props.show}>
        <Modal.Header closeButton>
          <Modal.Title>{props.isEditing ? 'Edit Actor' : 'Add Actor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { error ? <Alert variant={'danger'}>{error}</Alert> : null }
          <Form>
            <Form.Group controlId="actorForm.name">
              <Form.Label>Actor Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Enter Actor Name"
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="actorForm.age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                value={age || 0}
                placeholder="Enter Actor Age"
                onChange={(event) => setAge(+event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control as="select" value={gender} onChange={(event) => setGender(event.target.value as Gender)} custom>
                <option value={Gender.Male}>{getGenderDisplayString(Gender.Male)}</option>
                <option value={Gender.Female}>{getGenderDisplayString(Gender.Female)}</option>
                <option value={Gender.Unknown}>{getGenderDisplayString(Gender.Unknown)}</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="actorForm.movies">
              <Form.Label>Movies</Form.Label>
              <Select
                isMulti
                value={selectedMovies as ValueType<OptionType>}
                onChange={handleMovieSelectionChange}
                options={allMovies}
              />
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

export default withRouter(ActorForm);
