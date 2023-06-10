<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="showModal = true"> 添加学员 </t-button>
          <input ref="fileInput" type="file" style="display: none" />
          <div style="margin-right: 85px"></div>
          <t-button ghost @click="DownloadStudentExcel">下载导入模板</t-button>
          <t-button ghost @click="Upload">导入学员名单</t-button>
        </div>
        <div class="search-input">
          <t-input v-model="searchValue" placeholder="请输入你需要搜索的学员" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row>
      <stepTwoTable></stepTwoTable>
    </t-card>
    <div v-if="showModal">
      <stepTwoModal></stepTwoModal>
    </div>


  </div>
</template>

<script lang="ts">
export default {
  name: 'ListBase',
};
</script>

<script setup lang="ts">
import { SearchIcon, } from 'tdesign-icons-vue-next';
import { onMounted, provide, ref, toRaw } from 'vue';
import stepTwoModal from './stepTwoModal.vue';
import * as XLSX from 'xlsx';

import { useCourseStore } from '@/store/modules/course';

import stepTwoTable from './stepTwoTable.vue';
import axios from 'axios';

const showModal = ref(false);
const CloseModal = () => {
  showModal.value = false;
}
provide('CloseModal', CloseModal);
// 导入EXCEL

const courseStore = useCourseStore();
const fileInput = ref(null);
const Upload = () => {
  fileInput.value.click();
};

const ReadExcel = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 2 }) as any[];

    // console.log(jsonData); // 打印解析后的Excel数据
    let maxid = 0;
    courseStore.courseInfo.students.splice(0, courseStore.courseInfo.students.length);
    courseStore.courseInfo.students = jsonData.map((data) => {
      maxid++;
      return {
        id: maxid,
        name: data['学员姓名'],
        state: data['学员状态'],
        phoneNumber: data['联系方式'],
        position: data['职位职务'],
        courseRole: data['班级职务'],
        notes: data['备注'],
      };
    });
    console.log(toRaw(courseStore.courseInfo.students));
  };

  reader.readAsArrayBuffer(file);
};

const AddStudent = () => {
  showModal.value = true;
};
const DownloadStudentExcel = () => {
  axios({
    url: 'http://localhost:7035/Teacher/DownloadStudentExcel', // 你的API地址
    method: 'GET',
    responseType: 'blob', // 重要
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '导入人员.xlsx'); // 你的文件名
    document.body.appendChild(link);
    link.click();
  });
}
const searchValue = ref('');
onMounted(() => {
  // fetchData();
  fileInput.value.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    // 在这里进行文件处理和上传操作
    ReadExcel(selectedFile);
  });
});


</script>

<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>
