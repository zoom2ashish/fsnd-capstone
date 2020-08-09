import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Movie from '../../components/Movie/Movie';
import { MovieDto, MoviesProps, AlertData, ModalData } from '../../dto';
import MovieForm from '../../components/MovieForm/MovieForm';
import * as axiosMovies from '../../services/axios-movies';

const initialAlertState: AlertData = {visible: false };

const Movies = (props: React.PropsWithChildren<MoviesProps> & RouteComponentProps<{id?: string|undefined}>) => {
  const [alertData, setAlertData] = useState<AlertData>(initialAlertState)
  const [movieItems, setMovieItems] = useState<MovieDto[]>([]);
  const [modalData, setModalData] = useState<ModalData<MovieDto>>({
    visible: false,
    isEditing: false
  });

  useEffect(() => {
      axiosMovies.fetchMovies().then(data => {
        setMovieItems(data.results);
      })
  }, [modalData.visible]);

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
    data: movie
  });

  const onMovieDeleteClicked = (movieToDelete: MovieDto) => {
    axiosMovies.deleteMovie(movieToDelete.id)
      .then(() => {
        const updatedMovieItems = movieItems.filter(movie => movie.id !== movieToDelete.id);
        setMovieItems(updatedMovieItems);
        setAlertData({
          visible: true,
          message: `Movie '${movieToDelete.title}' deleted successfully`,
          alertType: 'success'
        });
      });
  };

  const handleModalClose = () => {
    setModalData({
      visible: false,
      isEditing: false
    });

  };

  const NUM_OF_CARD_PER_ROW = 3;
  const cardDesks: Array<JSX.Element[]> = [[]];
  movieItems.forEach((movieItem: MovieDto) => {
    if (cardDesks[cardDesks.length - 1].length >= NUM_OF_CARD_PER_ROW) {
      cardDesks.push([]);
    }
    cardDesks[cardDesks.length - 1].push(
      <Movie
        key={movieItem.id}
        data={movieItem}
        onEdit={() => onMovieEditClicked(movieItem)}
        onDelete={() => onMovieDeleteClicked(movieItem)}
      >
        {movieItem.title}
      </Movie>
    );
  });

  const noMoviesPlaceHolder = (
    <Col> No Movies Found </Col>
  );

  const modal = modalData.visible ? (
    <MovieForm show={modalData.visible} isEditing={modalData.isEditing} onClose={handleModalClose} data={modalData.data}></MovieForm>
  ) : null;

  return (
    <>
      <Row>
        <Col md="auto">
          <Button variant="primary" size="lg" className='mb-3' onClick={onMovieAddClicked}>Add Movie</Button>
        </Col>
        <Col>
          {alertData.visible ? <Alert key={1} variant={alertData.alertType || 'primary'}>{alertData.message}</Alert> : null }
        </Col>
      </Row>
      {
        movieItems.length > 0 ?  cardDesks.map((cards, index) => {
          return (
            <CardDeck key={index} className="mt-3">
              {cards}
            </CardDeck>
          );
        }) : noMoviesPlaceHolder
      }
      {modal}
    </>
  );
};

export default withRouter(Movies);