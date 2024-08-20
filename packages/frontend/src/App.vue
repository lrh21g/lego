<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

import { useGlobalStore } from '@/store/modules/global'

const route = useRoute()
const globalStore = useGlobalStore()

const isLoading = computed(() => globalStore.isLoading)
const showLoading = computed(
  () => isLoading.value && !route.meta.disableLoading,
)

const error = computed(() => globalStore.error)
watch(
  () => error.value.status,
  (errorValue) => {
    if (errorValue)
      message.error(error.value.message || '未知错误', 2)
  },
)
</script>

<template>
  <a-spin v-if="showLoading" tip="读取中" class="app-spinner" />
  <router-view />
</template>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}

.app-spinner {
  position: fixed;
  top: 10px;
  right: 50%;
}
</style>
