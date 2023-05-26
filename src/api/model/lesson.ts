import { classAdviserCost } from './classAdviserCost';
import { classRoomCost } from './classRoomCost';
import { lessonsLibrary } from './lessonsLibrary';
import { teacherCost } from './teacherCost';

export interface lesson {
  id: number;
  startTime: Date;
  endTime: Date;
  classCostAdvisers?: classAdviserCost[];
  teacherCosts?: teacherCost[];
  classRoomCosts?: classRoomCost[];
  lessonsLibrary: lessonsLibrary;
}
