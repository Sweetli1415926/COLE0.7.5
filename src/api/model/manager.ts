import { course } from './course';
import { person } from './person';

export interface manager extends person {
  workCode: string;
  telNumber?: string;
  office: string;
  department: string;
  courses?: course[];
}
