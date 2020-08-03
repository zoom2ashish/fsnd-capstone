import React, { useState, useEffect }  from 'react';
import classes from './Movies.module.css';
import Movie from '../../components/Movie/Movie';
import { MovieDto } from '../../dto';

export interface MoviesProps {
}

const Movies = (props: React.PropsWithChildren<MoviesProps>) => {
  const [movieItems, setMovieItems] = useState([]);

  useEffect(() => {
      fetch('/api/movies').then(response => response.json()).then(data => {
        setMovieItems(data.results);
      })
  }, []);

  const movies = movieItems.map((movieItem: MovieDto) => {
    return (<Movie key={movieItem.id} data={movieItem}></Movie>);
  });

  return (
    <>
      {movies}
    </>
  );
};

export default Movies;