import axios from './axios';
import { ActorListResultDto, ActorPostRequestDto, ActorDto } from '../dto';

const ACTORS_BASE_URL = '/api/actors';

export function fetchActors(): Promise<ActorListResultDto> {
  return axios.get(ACTORS_BASE_URL)
    .then(response => {
      return response.data
    });
}

export function createActor(actor: ActorPostRequestDto): Promise<ActorDto> {
  return axios.post(ACTORS_BASE_URL, actor);
}

export function updateActor(id: number, actor: ActorPostRequestDto): Promise<ActorDto> {
  return axios.patch(`${ACTORS_BASE_URL}/${id}` , actor);
}

export function deleteActor(id: number): Promise<any> {
  return axios.delete(ACTORS_BASE_URL + `/${id}`)
    .then(response => response);
}