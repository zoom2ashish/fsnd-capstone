import { Gender } from '../dto';

export function getGenderDisplayString(gender: Gender) {
  switch(gender) {
    case Gender.Male:
      return 'Male';
    case Gender.Female:
      return 'Female';
    default:
      return 'Unknown';
  }
}
