<script setup lang="ts">
import { ref } from 'vue'
import TemplateList from '@/components/TemplateList.vue'

const templateList = ref([])
const isLastPage = ref(true)
const isLoading = ref(false)

function loadMorePage() {}
</script>

<template>
  <a-row :gutter="16">
    <TemplateList :list="templateList" />
  </a-row>
  <a-row type="flex" justify="center">
    <a-button
      v-if="!isLastPage"
      type="primary"
      size="large"
      :loading="isLoading"
      @click="loadMorePage"
    >
      加载更多
    </a-button>
  </a-row>
</template>
