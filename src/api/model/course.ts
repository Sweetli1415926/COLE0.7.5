import { company } from './company';
import { lesson } from './lesson';
import { material } from './material';
import { student } from './student';

export interface course {
  id: number;
  totalIncome: number;
  name: string;
  students: student[];
  materials: material[];
  lessons: lesson[];
  company: company;
  startTime: Date;
  endTime: Date;
  state: string;
  payType: string;
  isCompanyPayTeacherCost: boolean;
  isCompanyPayHote: boolean;
  notes: string;
}
