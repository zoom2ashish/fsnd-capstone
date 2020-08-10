import axios from './axios';
import { MovieListResultDto, MoviePostRequestDto, MovieDto } from '../dto';

const MOVIES_BASE_URL = '/api/movies';

export function fetchMovies(): Promise<MovieListResultDto> {
  return axios.get(MOVIES_BASE_URL)
    .then(response => {
      return response.data
    }).catch(error => {
      console.log(error);
      throw error;
    });
}

export function createMovie(movie: MoviePostRequestDto): Promise<MovieDto> {
  return axios.post(MOVIES_BASE_URL, movie);
}

export function updateMovie(id: number, movie: MoviePostRequestDto): Promise<MovieDto> {
  return axios.patch(`${MOVIES_BASE_URL}/${id}` , movie);
}

export function deleteMovie(id: number): Promise<any> {
  return axios.delete(MOVIES_BASE_URL + `/${id}`)
    .then(response => response);
}