<template>
  <t-row :gutter="[16, 16]">
    <t-col :xs="6" :xl="3">
      <t-card title="总收入" :bordered="false" :class="{ 'dashboard-item': true, 'dashboard-item--main-color': true }">
        <div class="dashboard-item-top">
          <span :style="{ fontSize: `${resizeTime * 28}px` }">¥ {{ formatNumber(TotalIncome) }}</span>
        </div>
        <div class="dashboard-item-left">
          <div id="moneyContainer" class="dashboard-chart-container"
            :style="{ width: `${resizeTime * 120}px`, height: '100px', marginTop: '-24px' }"></div>
        </div>
        <template #footer>
          <div class="dashboard-item-bottom">
            <div class="dashboard-item-block">
              同比去年
              <trend class="dashboard-item-trend" :type="TotalIncomeUpOrDown ? 'down' : 'up'" :is-reverse-color="true"
                :describe="TotalIncomeUpOrDown" />
            </div>
            <t-icon name="chevron-right" />
          </div>
        </template>
      </t-card>
    </t-col>
    <t-col :xs="6" :xl="3">
      <t-card title="总成本" :bordered="false" :class="{ 'dashboard-item': true }">
        <div class="dashboard-item-top">
          <span :style="{ fontSize: `${resizeTime * 28}px` }">¥ {{ formatNumber(TotalCost) }}</span>
        </div>
        <div class="dashboard-item-left">
          <div id="refundContainer" class="dashboard-chart-container"
            :style="{ width: `${resizeTime * 120}px`, height: '56px', marginTop: '-24px' }"></div>
        </div>
        <template #footer>
          <div class="dashboard-item-bottom">
            <div class="dashboard-item-block">
              同比去年
              <trend class="dashboard-item-trend" :type="TotalCostUpOrDown ? 'down' : 'up'" :is-reverse-color="false"
                :describe="TotalCostUpOrDown" />
            </div>
            <t-icon name="chevron-right" />
          </div>
        </template>
      </t-card>
    </t-col>
    <t-col :xs="6" :xl="3">
      <t-card title="总课程数量" :bordered="false" :class="{ 'dashboard-item': true }">
        <div class="dashboard-item-top">
          <span :style="{ fontSize: `${resizeTime * 28}px` }">{{ Count }}</span>
        </div>
        <div class="dashboard-item-left">
          <span :style="{ marginTop: '-24px' }">
            <file-icon />
          </span>
        </div>

        <template #footer>
          <div class="dashboard-item-bottom">
            <div class="dashboard-item-block">
              同比去年
              <trend class="dashboard-item-trend" :type="CountUpOrDown.includes('-') ? 'down' : 'up'"
                :describe="CountUpOrDown" />
            </div>
            <t-icon name="chevron-right" />
          </div>
        </template>
      </t-card>
    </t-col>
    <t-col :xs="6" :xl="3">
      <t-card title="学生数量" :bordered="false" :class="{ 'dashboard-item': true }">
        <div class="dashboard-item-top">
          <span :style="{ fontSize: `${resizeTime * 28}px` }">{{ StudentCount }}</span>
        </div>
        <div class="dashboard-item-left">
          <span :style="{ marginTop: `-24px` }">
            <usergroup-icon />
          </span>
        </div>
        <template #footer>
          <div class="dashboard-item-bottom">
            <div class="dashboard-item-block">
              同比去年
              <trend class="dashboard-item-trend" :type="StudentCountUpOrDown.includes('-') ? 'down' : 'up'"
                :describe="StudentCountUpOrDown" />
            </div>
            <t-icon name="chevron-right" />
          </div>
        </template>
      </t-card>
    </t-col>
  </t-row>
</template>

<script lang="ts">
export default {
  name: 'DashboardBase',
};
</script>

<script setup lang="ts">
import { BarChart, LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { storeToRefs } from 'pinia';
import { FileIcon, UsergroupIcon } from 'tdesign-icons-vue-next';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

// 导入样式
import Trend from '@/components/trend/index.vue';
import { useManagerStore, useSettingStore } from '@/store';
import { changeChartsTheme } from '@/utils/color';

import { constructInitDashboardDataset } from '../index';

echarts.use([LineChart, BarChart, CanvasRenderer]);
const formatNumber = (num: any) => {
  if (num === undefined) {
    return 0;
  }
  const parts = num.toFixed(2).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
};

const managerStore = useManagerStore();
const {
  TotalIncome,
  TotalIncomeUpOrDown,
  TotalCost,
  TotalCostUpOrDown,
  Count,
  CountUpOrDown,
  StudentCount,
  StudentCountUpOrDown,
} = storeToRefs(managerStore);
const store = useSettingStore();
const resizeTime = ref(1);

// moneyCharts
let moneyContainer: HTMLElement;
let moneyChart: echarts.ECharts;
const renderMoneyChart = () => {
  if (!moneyContainer) {
    moneyContainer = document.getElementById('moneyContainer');
  }
  moneyChart = echarts.init(moneyContainer);
  moneyChart.setOption(constructInitDashboardDataset('line'));
};

// refundCharts
let refundContainer: HTMLElement;
let refundChart: echarts.ECharts;
const renderRefundChart = () => {
  if (!refundContainer) {
    refundContainer = document.getElementById('refundContainer');
  }
  refundChart = echarts.init(refundContainer);
  refundChart.setOption(constructInitDashboardDataset('bar'));
};

const renderCharts = () => {
  renderMoneyChart();
  renderRefundChart();
};

// chartSize update
const updateContainer = () => {
  if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
    resizeTime.value = Number((document.documentElement.clientWidth / 2080).toFixed(2));
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number((document.documentElement.clientWidth / 1080).toFixed(2));
  } else {
    resizeTime.value = 1;
  }
  moneyChart.resize({
    width: resizeTime.value * 120,
    // height: resizeTime.value * 100,
  });
  refundChart.resize({
    width: resizeTime.value * 120,
    // height: resizeTime.value * 56,
  });
};

onMounted(() => {
  managerStore.GetMangerInfo();
  renderCharts();
  nextTick(() => {
    updateContainer();
  });
  window.addEventListener('resize', updateContainer, false);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([refundChart]);
  },
);

watch(
  () => store.mode,
  () => {
    [moneyChart, refundChart].forEach((item) => {
      item.dispose();
    });

    renderCharts();
  },
);
</script>

<style lang="less" scoped>
.dashboard-item {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__footer) {
    padding: 0;
  }

  :deep(.t-card__title) {
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
  }

  :deep(.t-card__body) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    position: relative;
    padding: 0;
    margin-top: var(--td-comp-margin-s);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  &:hover {
    cursor: pointer;
  }

  &-top {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    >span {
      display: inline-block;
      color: var(--td-text-color-primary);
      font-size: var(--td-font-size-headline-medium);
      line-height: var(--td-line-height-headline-medium);
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    >.t-icon {
      cursor: pointer;
      font-size: var(--td-comp-size-xxxs);
    }
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-placeholder);
  }

  &-trend {
    margin-left: var(--td-comp-margin-s);
  }

  &-left {
    position: absolute;
    top: 0;
    right: 0;

    >span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--td-comp-size-xxxl);
      height: var(--td-comp-size-xxxl);
      background: var(--td-brand-color-light);
      border-radius: 50%;

      .t-icon {
        font-size: 24px;
        color: var(--td-brand-color);
      }
    }
  }

  // 针对第一个卡片需要反色处理
  &--main-color {
    background: var(--td-brand-color);
    color: var(--td-text-color-primary);

    :deep(.t-card__title),
    .dashboard-item-top span,
    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }

    .dashboard-item-block {
      color: var(--td-text-color-anti);
      opacity: 0.6;
    }

    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }
  }
}
</style>
