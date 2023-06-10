<template>
  <div>
    <t-dialog closeBtn destroyOnClose draggable mode="modeless" placement="center" footer header="添加新的学员" :visible="true"
      :onCancel="onCancel">
      <p>This is a dialog</p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const closeModal = inject<() => void>('CloseModal');
const onCancel = () => {
  closeModal();
}
</script>
