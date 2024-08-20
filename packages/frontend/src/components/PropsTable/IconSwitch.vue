<script lang="ts" setup>
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from '@ant-design/icons-vue'

interface IconComponents {
  [key: string]: any
}

const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  tip: {
    type: String,
  },
})
const emits = defineEmits(['change'])

const iconComponents: IconComponents = {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
}

function handleClick() {
  emits('change', !props.checked)
}
</script>

<template>
  <div class="icon-template" @click.prevent="handleClick">
    <a-tooltip>
      <template #title>
        {{ tip }}
      </template>
      <a-button :type="checked ? 'primary' : 'default'" shape="circle">
        <template #icon>
          <component :is="iconComponents[iconName]" />
        </template>
      </a-button>
    </a-tooltip>
  </div>
</template>
