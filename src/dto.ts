export enum Gender {
  Male = 'M',
  Female = 'F',
  Unknown = 'U'
}

export interface ActorDto {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  movies: MovieDto[];
}

export interface ActorPostRequestDto {
  id?: number;
  name: string;
  age: number;
  gender: Gender;
  movies?: number[];
}

export interface ActorListResultDto {
  count: number;
  results: ActorDto[];
}

export interface MovieDto {
  id: number;
  title: string;
  release_date?: number;
  actors?: ActorDto[]
}

export interface MoviePostRequestDto {
  id?: number;
  title: string;
  release_date?: number;
  actors: number[];
}

export interface MovieListResultDto {
  count: number;
  results: MovieDto[]
}

export interface MoviesProps{
}

export interface ActorsProps{
}

export interface ModalData<T> {
  visible: boolean;
  isEditing: boolean;
  data?: T;
}

export interface AlertData {
  visible: boolean;
  alertType?:   'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  message?: string;
}