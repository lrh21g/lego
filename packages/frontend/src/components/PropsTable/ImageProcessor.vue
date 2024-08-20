<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import Cropper from 'cropperjs'

import { message } from 'ant-design-vue'
import {
  DeleteOutlined,
  ScissorOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'

interface CropDataProps {
  x: number
  y: number
  width: number
  height: number
}

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  ratio: {
    type: Number,
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['change', 'uploaded'])

const showModal = ref(false)
const backgroundUrl = computed(() => `url(${props.value})`)
const baseImageUrl = computed(() => props.value.split('?')[0])
const cropperContainerRef = ref<null | HTMLImageElement>(null)

let cropper: Cropper | null = null
const cropData: CropDataProps | null = null
watch(showModal, async (newValue) => {
  if (newValue) {
    await nextTick()
    if (cropperContainerRef.value) {
      cropper = new Cropper(cropperContainerRef.value)

      const cropperCanvasDom = cropper.getCropperCanvas()
      if (cropperCanvasDom) {
        cropperCanvasDom.style.width = '100%'
        cropperCanvasDom.style.height = '400px'
      }
    }
  }
  else {
    if (cropper)
      cropper.getCropperCanvas()?.remove()
  }
})

function handleOk() {
  if (cropData) {
    const { x, y, width, height } = cropData
    const cropperURL = `${baseImageUrl.value}?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
    // 不使用 阿里云 OSS，拿到截图图片再次上传的处理方法
    // 这里实现还是采用原方法，假如同学们愿意使用重新上传的方法的话，请看下面注释的代码
    // cropper.getCroppedCanvas().toBlob((blob) => {
    //   if (blob) {
    //     const formData = new FormData()
    //     formData.append('croppedImage', blob, 'test.png')
    //     axios.post('http://local.test:7001/api/upload/', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     }).then(resp => {
    //       context.emit('change', resp.data.data.url)
    //       showModal.value = false
    //     })
    //   }
    // })
    emits('change', cropperURL)
  }
  showModal.value = false
}

// TODO resp 参数类型
function handleFileUploaded(data: { resp: any, file: File }) {
  const { resp } = data
  message.success('上传成功')
  emits('change', resp.data.urls[0])
  emits('uploaded', data)
}
function handleDelete() {
  emits('change', '')
}
</script>

<template>
  <div class="image-processor">
    <a-modal
      v-model:open="showModal"
      title="裁剪图片"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="showModal = false"
    >
      <img
        ref="cropperContainerRef"
        class="cropper-container"
        :src="baseImageUrl"
      >
      <!-- <div ref="cropperContainerRef" class="cropper-container" /> -->
    </a-modal>

    <div
      class="image-preview"
      :style="{ backgroundImage: backgroundUrl }"
      :class="{ 'extra-height': showDelete }"
    />
    <div class="image-process">
      <a-button @click="handleFileUploaded">
        <template #icon>
          <UploadOutlined />
        </template>
        更换图片
      </a-button>
      <a-button @click="showModal = true">
        <template #icon>
          <ScissorOutlined />
        </template>
        裁剪图片
      </a-button>
      <a-button v-if="showDelete" type="danger" @click="handleDelete">
        <template #icon>
          <DeleteOutlined />
        </template>
        删除图片
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.image-processor {
  display: flex;
  justify-content: space-between;
}

.image-preview {
  width: 150px;
  height: 84px;
  background: no-repeat 50% / contain;
  border: 1px dashed #e6ebed;
}

.image-preview.extra-height {
  height: 110px;
}

.image-process {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
  margin-left: 10px;
}

.image-cropper img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
