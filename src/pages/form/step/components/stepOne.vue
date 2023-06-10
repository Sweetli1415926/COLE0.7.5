<template>
  <!-- <button @click="consoletest">test</button> -->
  <!-- 分步表单1 -->
  <div class="rule-tips">
    <t-alert theme="info" title="业务分工细则：" :close="true">
      <template #message>
        <p>1、添加培训班信息之后由教务办公室统一联系老师,安排课程并分配上课教室;</p>
        <p>2、添加物料信息后由综合办公室统一采购,班主任或业务员签字领取</p>
        <p>3、财务办公室将统一收费及开票工作,并上传相关票据</p>
      </template>
    </t-alert>
  </div>
  <div style="margin-bottom: 40px"></div>
  <t-form class="step-form" :data="courseInfo" :rules="addNewCourseRules" label-align="right">
    <t-space>
      <t-form-item label="培训班状态" name="state">
        <t-select v-model="courseInfo.state" :style="{ width: '200px' }" class="demo-select-base" clearable>
          <t-option v-for="(item, index) in courseState" :key="index" :value="item.value" :label="item.label">
            {{ item.label }}
          </t-option>
        </t-select>
      </t-form-item>
      <div style="margin-right: 85px"></div>
      <t-form-item label="培训班名称" name="name">
        <t-input v-model="courseInfo.name" clearable :style="{ width: '300px' }"> </t-input>
      </t-form-item>
    </t-space>
    <div style="margin-bottom: 20px"></div>

    <t-space>
      <t-form-item label="培训时间" name="dateTimeSpan"><t-date-range-picker v-model="DateTimeSpan"
          :style="{ width: '300px' }" clearable allow-input /></t-form-item>
      <t-form-item v-model="courseInfo.company.name" label="对方单位名称" name="companyname">
        <t-input clearable :style="{ width: '300px' }"> </t-input>
      </t-form-item>
    </t-space>
    <div style="margin-bottom: 20px"></div>
    <t-space>
      <t-form-item label="缴费方式" name="payType">
        <t-select v-model="courseInfo.payType" :style="{ width: '200px' }" class="demo-select-base" clearable>
          <t-option v-for="(item, index) in payType" :key="index" :value="item.value" :label="item.label">
            {{ item.label }}
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="培训人数" name="PeronCount">
        <t-input-number v-model="personCount" theme="normal" :style="{ width: '60px' }" />
      </t-form-item>
      <div v-if="courseInfo.payType === '每人每天付费'">
        <t-form-item label="每人每天收费" name="perDayPerPersonFee">
          <t-input-number v-model="perDayPerPersonFee" theme="normal" :style="{ width: '100px' }" />
        </t-form-item>
      </div>
      <div v-if="courseInfo.payType === '整班按天付费'">
        <t-form-item label="每班每天收费" name="perDayPerPersonFee">
          <t-input-number v-model="perDayPerPersonFee" theme="normal" :style="{ width: '100px' }" />
        </t-form-item>
      </div>
    </t-space>
    <div style="margin-bottom: 20px"></div>
    <t-collapse>
      <t-collapse-panel header="具体开班信息" :borderless="true">
        <t-space>
          <t-form-item label="是否承担师资费" name="isCompanyPayTeacherCost">
            <t-select v-model="courseInfo.isCompanyPayTeacherCost" :style="{ width: '200px' }" class="demo-select-base"
              clearable>
              <t-option value="true" label="是"> 是 </t-option>
              <t-option value="false" label="否"> 否 </t-option>
            </t-select>
          </t-form-item>
          <t-form-item label="是否承担住宿费" name="isCompanyPayHote">
            <t-select v-model="courseInfo.isCompanyPayHote" :style="{ width: '200px' }" class="demo-select-base"
              clearable>
              <t-option value="true" label="是"> 是 </t-option>
              <t-option value="false" label="否"> 否 </t-option>
            </t-select>
          </t-form-item>
        </t-space>
        <div style="margin-bottom: 20px"></div>
        <t-space>
          <t-form-item label="培训天数" name="traningDay">
            <t-input-number v-model="traningDay" theme="normal" :style="{ width: '60px' }" />
          </t-form-item>
          <t-form-item label="付费天数" name="payDay">
            <t-input-number v-model="payDay" theme="normal" :style="{ width: '60px' }" /> </t-form-item><t-form-item
            label="合计收费金额" name="TotalIncome">
            <t-input-number v-model="courseInfo.totalIncome" theme="normal" :style="{ width: '110px' }" />
          </t-form-item>
        </t-space>
        <div style="margin-bottom: 20px"></div>
        <t-form-item label="需备注的内容" name="notes">
          <t-textarea :style="{ width: '100px' }" />
        </t-form-item>
      </t-collapse-panel>
    </t-collapse>
  </t-form>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { DateRangeValue, FormRule } from 'tdesign-vue-next';
import { ref } from 'vue';

import { useCourseStore } from '@/store/modules/course';
// 不提交表单的数据
const perDayPerPersonFee = ref('');
const personCount = ref('');
const payDay = ref('');
const traningDay = ref('');
// 把DateSpan转换为两个日期
const DateTimeSpan = ref([] as DateRangeValue);

const courseStore = useCourseStore();
const { courseInfo } = storeToRefs(courseStore);
const addNewCourseRules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入培训班名称', type: 'error' }],
  startTime: [{ required: true, message: '请输入开始日期', type: 'error' }],
  endTime: [{ required: true, message: '请输入截止日期', type: 'error' }],
  state: [{ required: true, message: '请输入培训班状态', type: 'error' }],
  dateTimeSpan: [{ required: true, message: '请输入培训班状态', type: 'error' }],
  companyname: [{ required: true, message: '请输入对方单位名称', type: 'error' }],
};
const courseState = [
  { label: '意向课程', value: '意向课程' },
  { label: '预定课程', value: '预定课程' },
  { label: '上课中', value: '上课中' },
  { label: '已完成', value: '已完成' },
];
const payType = [
  { label: '整班按天付费', value: '整班按天付费' },
  { label: '每人每天付费', value: '每人每天付费' },
];
</script>
