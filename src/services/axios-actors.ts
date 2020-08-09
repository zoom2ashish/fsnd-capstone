import axios from './axios';
import { ActorListResultDto } from '../dto';

const ACTORS_BASE_URL = '/api/actors';

export function fetchActors(): Promise<ActorListResultDto> {
  return axios.get(ACTORS_BASE_URL)
    .then(response => {
      return response.data
    });
}


export function deleteActor(id: number): Promise<any> {
  return axios.delete(ACTORS_BASE_URL + `/${id}`)
    .then(response => response);
}