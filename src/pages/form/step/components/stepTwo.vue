<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="AddStudent"> 添加学员 </t-button>
          <input ref="fileInput" type="file" style="display: none" />
          <div style="margin-right: 85px"></div>
          <t-button ghost>下载导入模板</t-button>
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
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListBase',
};
</script>

<script setup lang="ts">
import {
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
  ErrorCircleFilledIcon,
  SearchIcon,
} from 'tdesign-icons-vue-next';
import { MessagePlugin, PrimaryTableCol, RequestMethodResponse, TableRowData, UploadFile } from 'tdesign-vue-next';
import { computed, onMounted, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

import { getList } from '@/api/list';
import Trend from '@/components/trend/index.vue';
import { prefix } from '@/config/global';
import { CONTRACT_PAYMENT_TYPES, CONTRACT_STATUS, CONTRACT_TYPES } from '@/constants';
import { useSettingStore } from '@/store';
import { useCourseStore } from '@/store/modules/course';

import stepTwoTable from './stepTwoTable.vue';

const studentStateOptions = [
  { value: '已报到', label: '已报到' },
  { value: '未报到', label: '未报到' },
  { value: '报名但不到', label: '报名但不到' },
  { value: '只参加开班', label: '只参加开班' },
];
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
  console.log(courseStore.courseInfo.students);
};
const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '学员姓名',
    align: 'left',
    width: 120,
    colKey: 'name',
    fixed: 'left',
  },
  { title: '是否报到', colKey: 'state', width: 160 },
  {
    title: '联系方式',
    width: 160,
    colKey: 'phoneNumber',
  },
  {
    title: '职位职务',
    width: 160,
    colKey: 'position',
  },
  {
    title: '班级职务',
    width: 160,
    colKey: 'courseRole',
  },
  {
    title: '备注',
    width: 160,
    colKey: 'notes',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 160,
    colKey: 'op',
    title: '操作',
  },
];
const store = useSettingStore();
const data = ref([]);
const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});

const searchValue = ref('');

const dataLoading = ref(false);
const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { name } = data.value[deleteIdx.value];
    return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
  }
  return '';
});

onMounted(() => {
  // fetchData();
  fileInput.value.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    // 在这里进行文件处理和上传操作
    ReadExcel(selectedFile);
  });
});

const confirmVisible = ref(false);

const selectedRowKeys = ref([1, 2]);

const router = useRouter();

const resetIdx = () => {
  deleteIdx.value = -1;
};

const onConfirmDelete = () => {
  // 真实业务请发起请求
  data.value.splice(deleteIdx.value, 1);
  pagination.value.total = data.value.length;
  const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value);
  if (selectedIdx > -1) {
    selectedRowKeys.value.splice(selectedIdx, 1);
  }
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
  resetIdx();
};

const onCancel = () => {
  resetIdx();
};

const rowKey = 'index';

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr, pageInfo) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = (row) => {
  console.log(row);
};
const handleSetupContract = () => {
  router.push('/form/base');
};
const handleClickDelete = (row: { rowIndex: any }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    } as any),
);
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
