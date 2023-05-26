<template>
  <div>
    <div class="form-step-container">
      <!-- 简单步骤条 -->
      <t-card :bordered="false">
        <t-steps class="step-container" :current="activeForm" status="process">
          <t-step-item title="开设新的培训班" content="已于4月21日提交" />
          <t-step-item title="添加人员信息" content="将所有上课学院导入" />
          <t-step-item title="添加课程、教师、教室信息" content="由教务办公室分配" />
          <t-step-item title="添加物料信息" content="由综合办公室采购" />
          <t-step-item title="开具相关票据" content="由财务办公室收费开票" />
        </t-steps>
      </t-card>
      <div style="margin-bottom: 20px"></div>
       <!-- <stepOne></stepOne> -->
      <stepTwo></stepTwo>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FormStep',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';

import stepOne from './components/stepOne.vue';
import stepTwo from './components/stepTwo.vue';
const activeForm = ref(0);

// const watchtime = () => {
//   console.log(DateTimeSpan);
// };
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
