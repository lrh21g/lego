<script lang="ts" setup>
import { message } from 'ant-design-vue'
import StyledUploader from '../StyledUploader/index.vue'
import ImageProcessor from './ImageProcessor.vue'

defineProps({
  value: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['change'])

// TODO : resp 参数类型
function onImageUploaded(data: { resp: any, file: File }) {
  const { resp } = data
  message.success('上传成功')
  emits('change', resp.data.urls[0])
}
function handleUploadUrl(url: string) {
  emits('change', url)
}
</script>

<template>
  <StyledUploader v-if="!value" @success="onImageUploaded" />
  <ImageProcessor
    v-else
    :value="value"
    :show-delete="true"
    @change="handleUploadUrl"
  />
</template>
