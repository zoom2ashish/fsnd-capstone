import axios from './axios';
import { MovieListResultDto } from '../dto';

const MOVIES_BASE_URL = '/api/movies';

export function fetchMovies(): Promise<MovieListResultDto> {
  return axios.get(MOVIES_BASE_URL)
    .then(response => {
      return response.data
    });
}


export function deleteMovie(id: number): Promise<any> {
  return axios.delete(MOVIES_BASE_URL + `/${id}`)
    .then(response => response);
}