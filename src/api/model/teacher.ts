import { lessonsLibrary } from './lessonsLibrary';
import { person } from './person';

export interface teacher extends person {
  jobTitle: string;
  brief: string;
  bankCode: string;
  bankName: string;
  introduce: string;
  lessonsLibrary: lessonsLibrary[];
  remunerationNormal: number;
  canGotoSuzhou?: boolean;
  workPlace: string;
  department: string;
}
