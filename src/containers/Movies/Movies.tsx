import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Movie from '../../components/Movie/Movie';
import { MovieDto } from '../../dto';
import MovieForm from '../../components/MovieForm/MovieForm';

export interface MoviesProps{
}

export interface ModalData {
  visible: boolean;
  isEditing: boolean;
  movie?: MovieDto;
}

const Movies = (props: React.PropsWithChildren<MoviesProps> & RouteComponentProps<{id?: string|undefined}>) => {
  const [movieItems, setMovieItems] = useState([]);
  const [modalData, setModalData] = useState<ModalData>({
    visible: false,
    isEditing: false
  });

  useEffect(() => {
      fetch('/api/movies').then(response => response.json()).then(data => {
        setMovieItems(data.results);
      })
  }, []);

  const onMovieAddClicked = () => {
    setModalData({
      ...modalData,
      visible: true,
      isEditing: false
    });
  };

  const onMovieEditClicked = (movie: MovieDto) => setModalData({
    ...modalData,
    visible: true,
    isEditing: true,
    movie: movie
  });

  const onMovieEditDeleted = (id: number) => {
    console.log('Movie Id Deleted', id);
  };

  const handleModalClose = () => {
    setModalData({
      visible: false,
      isEditing: false,

    });
  };

  const movieListItems = movieItems.map((movieItem: MovieDto) => {
    return (
        <Movie
          key={movieItem.id}
          data={movieItem}
          onEdit={() => onMovieEditClicked(movieItem)}
          onDelete={() => onMovieEditDeleted(movieItem.id)}
        >
          {movieItem.title}
        </Movie>
    );
  });

  const noMoviesPlaceHolder = (
    <Col> No Movies Found </Col>
  );

  const modal = modalData.visible ? (
    <MovieForm show={modalData.visible} onClose={handleModalClose} data={modalData.movie}></MovieForm>
  ) : null;

  return (
    <>
      <Button variant="primary" size="lg" className='mb-3' onClick={onMovieAddClicked}>Add Movie</Button>
      <CardDeck>
        {movieListItems.length > 0 ? movieListItems : noMoviesPlaceHolder}
      </CardDeck>

      {modal}
    </>
  );
};

export default withRouter(Movies);