<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
import useKeyPress from '@/hooks/useKeyPress'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['change'])

let cachedOldValue = ''
const innerValue = ref(props.value)
const validateInnerValue = computed(() => innerValue.value.trim() !== '')
watch(
  () => props.value,
  (newValue) => {
    innerValue.value = newValue
  },
)

const inlineEditContainerRef = ref<HTMLElement | null>(null)
const inlineEditInputRef = ref<HTMLInputElement | null>(null)
const isOutside = useClickOutside(inlineEditContainerRef)

const isEditing = ref(false)
function handleClick() {
  isEditing.value = true
}
watch(isEditing, async (newValue) => {
  if (newValue) {
    cachedOldValue = innerValue.value
    await nextTick()
    if (inlineEditInputRef.value) {
      inlineEditInputRef.value.focus()
    }
  }
})
watch(isOutside, (newValue) => {
  if (!validateInnerValue.value)
    return

  if (newValue && isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
  isOutside.value = false
})
useKeyPress('Enter', () => {
  if (!validateInnerValue.value)
    return

  if (isEditing.value) {
    isEditing.value = false
    emit('change', innerValue.value)
  }
})
useKeyPress('Escape', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = cachedOldValue
  }
})
</script>

<template>
  <div
    ref="inlineEditContainerRef"
    class="inline-edit-container"
    @click.stop="handleClick"
  >
    <a-input
      v-if="isEditing"
      ref="inlineEditInputRef"
      v-model:value="innerValue"
      placeholder="文本不能为空"
      :status="!validateInnerValue ? 'error' : ''"
    />
    <slot v-else :text="innerValue">
      <span class="">{{ innerValue }}</span>
    </slot>
  </div>
</template>

<style lang="less" scoped>
.inline-edit-container {
  cursor: pointer;

  // .ant-input.ant-input-status-error {
  //   border: 1px solid #f5222d;
  // }

  // .ant-input.ant-input-status-error:focus {
  //   border-color: #f5222d;
  // }

  // .ant-input.ant-input-status-error::placeholder {
  //   color: #f5222d;
  // }
}
</style>
