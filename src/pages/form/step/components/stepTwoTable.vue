<template>
  <div class="t-table-demo__editable-row">
    <!-- 当前示例包含：输入框、单选、多选、日期 等场景 -->
    <t-table
      ref="tableRef"
      row-key="key"
      :data="courseStore.courseInfo.students"
      :columns="columns"
      :editable-row-keys="editableRowKeys"
      table-layout="auto"
      bordered
      @row-edit="onRowEdit"
      @row-validate="onRowValidate"
      @validate="onValidate"
    />
  </div>
</template>

<script setup lang="jsx">
import dayjs from 'dayjs';
import { CheckCircleFilledIcon, CloseCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue-next';
import { DatePicker, Input, MessagePlugin, Select } from 'tdesign-vue-next';
import { computed, ref } from 'vue';

import { useCourseStore } from '@/store/modules/course';

const tableRef = ref();
const data = ref([]);
const editableRowKeys = ref([]);
const currentSaveId = ref('');

const courseStore = useCourseStore();
const test = () => {
  console.log(courseStore.courseInfo.students);
};

// 保存变化过的行信息
const editMap = {};

const onEdit = (e) => {
  const { id } = e.currentTarget.dataset;
  if (!editableRowKeys.value.includes(id)) {
    editableRowKeys.value.push(id);
  }
};

// 更新 editableRowKeys
const updateEditState = (id) => {
  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};

const onCancel = (e) => {
  const { id } = e.currentTarget.dataset;
  updateEditState(id);
  tableRef.value.clearValidateData();
};

const onSave = (e) => {
  const { id } = e.currentTarget.dataset;
  currentSaveId.value = id;
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  tableRef.value.validateRowData(id).then((params) => {
    console.log('Event Table Promise Validate:', params);
    if (params.result.length) {
      const r = params.result[0];
      MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
      return;
    }
    // 如果是 table 的父组件主动触发校验
    if (params.trigger === 'parent' && !params.result.length) {
      const current = editMap[currentSaveId.value];
      if (current) {
        data.value.splice(current.rowIndex, 1, current.editedRow);
        MessagePlugin.success('保存成功');
      }
      updateEditState(currentSaveId.value);
    }
  });
};

// 行校验反馈事件，tableRef.value.validateRowData 执行结束后触发
const onRowValidate = (params) => {
  console.log('Event Table Row Validate:', params);
};

function onValidateTableData() {
  // 执行结束后触发事件 validate
  tableRef.value.validateTableData().then((params) => {
    console.log('Promise Table Data Validate:', params);
    const cellKeys = Object.keys(params.result);
    const firstError = params.result[cellKeys[0]];
    if (firstError) {
      MessagePlugin.warning(firstError[0].message);
    }
  });
}

// 表格全量数据校验反馈事件，tableRef.value.validateTableData() 执行结束后触发
function onValidate(params) {
  console.log('Event Table Data Validate:', params);
}

const onRowEdit = (params) => {
  const { row, col, value } = params;
  const oldRowData = editMap[row.key]?.editedRow || row;
  const editedRow = { ...oldRowData, [col.colKey]: value };
  editMap[row.key] = {
    ...params,
    editedRow,
  };

  // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
  // const newData = [...data.value];
  // newData[rowIndex] = editedRow;
  // data.value = newData;
};
const studentStateOptions = [
  { value: '0', label: '已报到' },
  { value: '1', label: '未报到' },
  { value: '2', label: '报名但不到' },
  { value: '3', label: '只参加开班' },
];
const columns = computed(() => [
  {
    title: '学员姓名',
    colKey: 'name',
    align: 'center',
    width: 120,
    edit: {
      component: Input,
      props: {
        clearable: true,
        autofocus: true,
        width: 120,
      },
      showEditIcon: false,
    },
  },
  {
    title: '学员状态',
    align: 'center',
    colKey: 'state',
    width: 100,
    // cell: (h, { row }) => studentStateOptions.find((t) => t.value === row.state)?.label,
    edit: {
      component: Select,
      props: {
        clearable: true,
        autoWidth: true,
        options: studentStateOptions,
      },
      showEditIcon: false,
    },
  },
  {
    title: '联系方式',
    align: 'center',
    colKey: 'phoneNumber',
    width: 160,
    edit: {
      component: Input,
      props: {
        width: 160,
        clearable: true,
        autofocus: true,
      },
      showEditIcon: false,
    },
  },
  {
    title: '职位职务',
    align: 'center',
    colKey: 'position',
    width: 140,
    edit: {
      component: Input,
      props: {
        width: 140,
        clearable: true,
        autofocus: true,
      },
      showEditIcon: false,
    },
  },
  {
    title: '班级职务',
    align: 'center',
    colKey: 'courseRole',
    width: 140,
    edit: {
      component: Input,
      props: {
        width: 140,
        clearable: true,
        autofocus: true,
      },
      showEditIcon: false,
    },
  },
  {
    title: '备注',
    align: 'center',
    colKey: 'notes',
    width: 140,
    edit: {
      component: Input,
      props: {
        width: 140,
        clearable: true,
        autofocus: true,
      },
      showEditIcon: false,
    },
  },
  {
    title: '操作栏',
    align: 'center',
    colKey: 'operate',
    width: 150,
    cell: (h, { row }) => {
      const editable = editableRowKeys.value.includes(row.key);
      return (
        <div class="table-operations">
          {!editable && (
            <t-link theme="primary" hover="color" data-id={row.key} onClick={onEdit}>
              编辑
            </t-link>
          )}
          {editable && (
            <t-link theme="primary" hover="color" data-id={row.key} onClick={onSave}>
              保存
            </t-link>
          )}
          {editable && (
            <t-link theme="primary" hover="color" data-id={row.key} onClick={onCancel}>
              取消
            </t-link>
          )}
        </div>
      );
    },
  },
]);
</script>

<style scoped>
.t-table-demo__editable-row .table-operations > .t-link {
  margin-right: 8px;
}

.t-table-demo__editable-row .t-demo-col__datepicker .t-date-picker {
  width: 120px;
}
</style>
