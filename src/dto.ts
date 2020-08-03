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

export interface MovieListResultDto {
  count: number;
  results: MovieDto[]
}
