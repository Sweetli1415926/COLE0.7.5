import { defineStore } from 'pinia';
import { course } from '@/api/model/course';
import { manager } from '@/api/model/manager';
import { material } from '@/api/model/material';
import { request } from '@/utils/request';

export const useManagerStore = defineStore('course', {
  state: () => ({
    managerInfo: {} as manager,
  }),
  getters: {
    TotalIncome: (state) => {
      const { courses } = state.managerInfo;
      const SummaryIncome = courses?.reduce((total, course) => course.totalIncome + total, 0);
      return SummaryIncome;
    },
    TotalCost: (state) => {
      const { courses } = state.managerInfo;
      const totalPriceSum = courses?.reduce((accumulator: number, currentCourse: course) => {
        const materials = currentCourse.materials || [];
        const totalPrice = materials?.reduce((total: number, currentMaterial: material) => {
          return total + (currentMaterial.totalPrice || 0);
        }, 0);
        return accumulator + totalPrice;
      }, 0);
      return totalPriceSum;
    },
    Count: (state) => {
      const { courses } = state.managerInfo;
      return courses?.length;
    },
    StudentCount: (state) => {
      const { courses } = state.managerInfo;
      const studentCount = courses?.reduce((accumulator: number, currentCourse: course) => {
        return accumulator + (currentCourse.students ? currentCourse.students.length : 0);
      }, 0);
      return studentCount;
    },
    TotalIncomeUpOrDown: () => {
      return '20.5%';
    },
    TotalCostUpOrDown: () => {
      return '-10.5%';
    },
    TotalCountUpOrDown: () => {
      return '15.3%';
    },
    StudentCountUpOrDown: () => {
      return '15.3%';
    },
    CountUpOrDown: () => {
      return '15.3%';
    },
  },
  actions: {
    async GetMangerInfo() {
      try {
        this.managerInfo = await request.get<manager>({
          url: '/Manager/GetManagerInfo',
        });
      } catch (error) {
        // return error;
        console.error('fetch manage info error', error);
      }
      // GetMangerInfo()
      //   .then((result) => {
      //     this.managerInfo = result;
      //     console.log(this.managerInfo);
      //   })
      //   .catch((err) => {
      //     console.log('异常', err);
      //   });
    },
  },
});
