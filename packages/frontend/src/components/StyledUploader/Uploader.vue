<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { last } from 'lodash-es'

import {
  DeleteOutlined,
  FileOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type FileListType = 'picture' | 'text'
type CheckUpload = (file: File) => boolean | Promise<File>

export interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
  url?: string
}

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  beforeUpload: {
    type: Function as PropType<CheckUpload>,
  },
  drag: {
    type: Boolean,
    default: false,
  },
  autoUpload: {
    type: Boolean,
    default: true,
  },
  listType: {
    type: String as PropType<FileListType>,
    default: 'text',
  },
  showUploadList: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(['success', 'error', 'change'])
defineExpose({ uploadFiles })

const fileInput = ref<null | HTMLInputElement>(null)
const filesList = ref<UploadFile[]>([])
const isDragOver = ref(false)
const isUploading = computed(() => {
  return filesList.value.some(file => file.status === 'loading')
})
const lastFileData = computed(() => {
  // _.last(array) 获取array中的最后一个元素。
  // eg:
  // _.last([1, 2, 3]);
  // => 3
  const lastFile = last(filesList.value)
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp,
    }
  }
  return false
})

function postFile(readyFile: UploadFile) {
  const formData = new FormData()
  formData.append(readyFile.name, readyFile.raw)
  readyFile.status = 'loading'

  axios
    .post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((resp) => {
      readyFile.status = 'success'
      readyFile.resp = resp.data
      emits('success', {
        resp: resp.data,
        file: readyFile,
        list: filesList.value,
      })
    })
    .catch((e: any) => {
      readyFile.status = 'error'
      emits('error', { error: e, file: readyFile, list: filesList.value })
    })
    .finally(() => {
      if (fileInput.value)
        fileInput.value.value = ''
    })
}

function addFileToList(uploadedFile: File) {
  const fileObj = reactive<UploadFile>({
    uid: uuidv4(),
    size: uploadedFile.size,
    name: uploadedFile.name,
    status: 'ready',
    raw: uploadedFile,
  })
  if (props.listType === 'picture') {
    try {
      fileObj.url = URL.createObjectURL(uploadedFile)
    }
    catch (err) {
      console.error('upload File error', err)
    }
    // FileReader to preview local image
    // const fileReader = new FileReader()
    // fileReader.readAsDataURL(uploadedFile)
    // fileReader.addEventListener('load', () => {
    //   fileObj.url = fileReader.result as string
    // })
  }
  filesList.value.push(fileObj)
  if (props.autoUpload)
    postFile(fileObj)
}

function beforeUploadCheck(files: null | FileList) {
  if (files) {
    const uploadedFile = files[0]
    if (props.beforeUpload) {
      const result = props.beforeUpload(uploadedFile)
      if (result && result instanceof Promise) {
        result
          .then((processedFile) => {
            if (processedFile instanceof File)
              addFileToList(processedFile)
            else
              throw new Error('beforeUpload Promise should return File object')
          })
          .catch((e) => {
            console.error(e)
          })
      }
      else if (result === true) {
        addFileToList(uploadedFile)
      }
    }
    else {
      addFileToList(uploadedFile)
    }
  }
}

function uploadFiles() {
  filesList.value
    .filter(file => file.status === 'ready')
    .forEach(readyFile => postFile(readyFile))
}

function removeFile(id: string) {
  filesList.value = filesList.value.filter(file => file.uid !== id)
}

function triggerUpload() {
  if (fileInput.value)
    fileInput.value.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  beforeUploadCheck(target.files)
}

function handleDrag(e: DragEvent, over: boolean) {
  e.preventDefault()
  isDragOver.value = over
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  if (e.dataTransfer)
    beforeUploadCheck(e.dataTransfer.files)
}

let events: { [key: string]: (e: any) => void } = {
  click: triggerUpload,
}
if (props.drag) {
  events = {
    ...events,
    dragover: (e: DragEvent) => {
      handleDrag(e, true)
    },
    dragleave: (e: DragEvent) => {
      handleDrag(e, false)
    },
    drop: handleDrop,
  }
}
</script>

<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'is-dragover': drag && isDragOver }"
      v-on="events"
    >
      <slot v-if="isUploading" name="loading">
        <button disabled>
          正在上传
        </button>
      </slot>
      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploaded-data="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    >
    <ul v-if="showUploadList" :class="`upload-list upload-list-${listType}`">
      <li
        v-for="file in filesList"
        :key="file.uid"
        :class="`uploaded-file upload-${file.status}`"
      >
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
        >
        <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"><DeleteOutlined /></span>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.upload-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.upload-list li {
  position: relative;
  box-sizing: border-box;
  min-width: 200px;
  margin-top: 5px;
  font-size: 14px;
  line-height: 1.8;
  border-radius: 4px;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

  &:first-child {
    margin-top: 10px;
  }

  .upload-list-thumbnail {
    position: relative;
    z-index: 1;
    display: inline-block;
    width: 70px;
    height: 70px;
    vertical-align: middle;
    object-fit: cover;
    background-color: #fff;
  }

  .file-icon {
    svg {
      margin-right: 5px;
      color: rgb(0 0 0 / 45%);
    }
  }

  .filename {
    margin-right: 40px;
    margin-left: 5px;
  }

  &.upload-error {
    color: #f5222d;

    svg {
      color: #f5222d;
    }
  }

  .file-status {
    position: absolute;
    top: 0;
    right: 5px;
    display: block;
    line-height: inherit;
  }

  .delete-icon {
    position: absolute;
    top: 0;
    right: 7px;
    display: none;
    line-height: inherit;
    cursor: pointer;
  }

  &:hover {
    background-color: #efefef;

    .file-status {
      display: none;
    }

    .delete-icon {
      display: block;
    }
  }
}
</style>
