import { person } from './person';

export interface student extends person {
  workPlace?: string;
  position?: string;
  courseRole?: string;
  tuition?: number;
}
