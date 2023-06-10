import { defineStore, storeToRefs } from 'pinia';

import { course } from '@/api/model/course';
import { request } from '@/utils/request';

import { useManagerStore } from './manager';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courseInfo: {
      id: 0,
      totalIncome: 0,
      name: '',
      students: [],
      materials: [],
      lessons: [],
      company: {},
      startTime: null,
      endTime: null,
      state: '',
      payType: '',
      isCompanyPayTeacherCost: null,
      isCompanyPayHote: null,
      notes: '',
    } as course,
  }),
  getters: {},
  actions: {
    async PostCourse(Course: course) {
      try {
        this.courseInfo.id = await request.post<number>({
          url: '/Course/AddOrUpdateCourse',
          data: Course,
        });
      } catch (error) {
        console.error('CourseError', error);
      }
    },
    async GetCourse(CourseId: number) {
      const managerStore = useManagerStore();
      const { managerInfo } = storeToRefs(managerStore);
      return managerInfo.value.courses.find((x) => x.id === CourseId);
    },
  },
});
