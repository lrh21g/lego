<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'

type ErrorType = 'size' | 'format' | null
interface CheckCondition {
  format?: string[]
  size?: number // 单位: M
}

defineProps({
  text: {
    type: String,
    default: '上传图片',
  },
  showUploaded: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['success'])

function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorType = null
  if (!isValidFormat)
    error = 'format'

  if (!isValidSize)
    error = 'size'

  return {
    passed: isValidFormat && isValidSize,
    error,
  }
}

function commonUploadCheck(file: File) {
  const result = beforeUploadCheck(file, {
    format: ['image/jpeg', 'image/png'],
    size: 1,
  })
  const { passed, error } = result
  if (error === 'format')
    message.error('上传图片只能是 JPG/PNG 格式!')

  if (error === 'size')
    message.error('上传图片大小不能超过 1Mb')

  return passed
}

function handleUploadSuccess(resp: any, file: File) {
  emits('success', { resp, file })
}
</script>

<template>
  <Uploader
    class="styled-uploader"
    action="/utils/upload-img"
    :show-upload-list="false"
    :before-upload="commonUploadCheck"
    @success="
      (data) => {
        handleUploadSuccess(data.resp, data.file.raw);
      }
    "
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>{{ text }}</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded="dataProps">
      <div class="uploader-container">
        <img v-if="showUploaded" :src="dataProps.uploadedData.data.urls[0]">
        <template v-else>
          <FileImageOutlined />
          <h4>{{ text }}</h4>
        </template>
      </div>
    </template>
  </Uploader>
</template>

<style lang="less" scoped>
.styled-uploader {
  .uploader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 100px;
    padding: 10px;
    color: #fff;
    cursor: pointer;
    background: #1890ff;
    border-radius: 5px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .uploader-container:hover {
    background: #40a9ff;
  }

  .uploader-container h4 {
    margin-bottom: 0;
    margin-left: 10px;
    color: #fff;
  }

  .uploader-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
