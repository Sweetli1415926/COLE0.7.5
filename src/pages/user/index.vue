<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{ managerInfo.name }}
          <span class="regular"> 下午好，今天是你加终生教育学院的第705天～</span>
        </div>
        <img src="@/assets/assets-tencent-logo.png" class="logo" />
      </div>

      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-row class="content" justify="space-between">
          <t-col class="contract" :span="4">
            <div class="contract-title">工资号</div>
            <div class="contract-detail">{{ managerInfo.workCode }}</div>
          </t-col>
          <t-col class="contract" :span="4">
            <div class="contract-title">手机</div>
            <div class="contract-detail">{{ managerInfo.phoneNumber }}</div>
          </t-col>
          <t-col class="contract" :span="4">
            <div class="contract-title">座机</div>
            <div class="contract-detail">{{ managerInfo.telNumber }}</div>
          </t-col>
          <t-col class="contract" :span="4">
            <div class="contract-title">邮箱</div>
            <div class="contract-detail">{{ managerInfo.email }}</div>
          </t-col>
          <t-col class="contract" :span="4">
            <div class="contract-title">所属部门</div>
            <div class="contract-detail">{{ managerInfo.department }}</div>
          </t-col>
          <t-col class="contract" :span="4">
            <div class="contract-title">办公室</div>
            <div class="contract-detail">{{ managerInfo.office }}</div>
          </t-col>
        </t-row>
      </t-card>

      <t-card class="content-container" :bordered="false">
        <t-tabs value="second">
          <t-tab-panel value="first" label="意向课程列表">
            <p>内容列表</p>
          </t-tab-panel>
          <t-tab-panel value="second" label="即将上课列表">
            <t-card :bordered="false" class="card-padding-no" title="主页访问数据" describe="（次）">
              <template #actions>
                <t-date-range-picker
                  class="card-date-picker-container"
                  :default-value="LAST_30_DAYS"
                  theme="primary"
                  mode="date"
                  @change="onLineChange"
                />
              </template>
              <div id="lineContainer" style="width: 100%; height: 328px" />
            </t-card>
          </t-tab-panel>
          <t-tab-panel value="third" label="正在上课列表">
            <p>内容列表</p>
          </t-tab-panel>
          <t-tab-panel value="third" label="已上完课列表">
            <p>内容列表</p>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </t-col>

    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">T</t-avatar>
        <div class="name">My Account</div>
        <div class="position">XXG 港澳业务拓展组员工 直客销售</div>
      </t-card>

      <t-card title="团队成员" class="user-team" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in TEAM_MEMBERS" :key="index">
            <t-list-item-meta :image="item.avatar" :title="item.title" :description="item.description" />
          </t-list-item>
        </t-list>
      </t-card>

      <t-card title="服务产品" class="product-container" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-row class="content" :getters="16">
          <t-col v-for="(item, index) in PRODUCT_LIST" :key="index" :span="3">
            <component :is="getIcon(item)"></component>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>
</template>
<script lang="ts">
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue';

import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';
import { useManagerStore, useSettingStore } from '@/store';
import { changeChartsTheme } from '@/utils/color';
import { LAST_30_DAYS } from '@/utils/date';

import { PRODUCT_LIST, TEAM_MEMBERS } from './constants';
import { getFolderLineDataSet } from './index';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

let lineContainer: HTMLElement;
let lineChart: echarts.ECharts;
const store = useSettingStore();
const chartColors = computed(() => store.chartColors);
const onLineChange = (value) => {
  lineChart.setOption(getFolderLineDataSet(value));
};

const initChart = () => {
  lineContainer = document.getElementById('lineContainer');
  lineChart = echarts.init(lineContainer);
  lineChart.setOption({
    grid: {
      x: 30, // 默认是80px
      y: 30, // 默认是60px
      x2: 10, // 默认80px
      y2: 30, // 默认60px
    },
    ...getFolderLineDataSet({ ...chartColors.value }),
  });
};

const updateContainer = () => {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  });
};
const managerStore = useManagerStore();
const { managerInfo } = storeToRefs(managerStore);

onMounted(() => {
  managerStore.GetMangerInfo();
  nextTick(() => {
    initChart();
  });
  window.addEventListener('resize', updateContainer, false);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

const getIcon = (type) => {
  switch (type) {
    case 'a':
      return ProductAIcon;
    case 'b':
      return ProductBIcon;
    case 'c':
      return ProductCIcon;
    case 'd':
      return ProductDIcon;
    default:
      return ProductAIcon;
  }
};

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart]);
  },
);
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
