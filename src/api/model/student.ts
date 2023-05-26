import { person } from './person';

export interface student extends person {
  workPlace?: string;
  position?: string;
  courseRoles?: string;
  tuition?: number;
}
