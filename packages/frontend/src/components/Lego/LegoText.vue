<script setup lang="ts">
import { textComponentProps, textStylePropNames } from './defaultProps'
import useComponentCommon from '@/hooks/useComponentCommon.ts'

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
  ...textComponentProps,
})

const { styleProps, handleClick } = useComponentCommon(
  props,
  textStylePropNames,
)
</script>

<template>
  <component
    :is="tag"
    :style="styleProps"
    class="l-text-component"
    @click="handleClick"
  >
    {{ text }}
  </component>
</template>

<style lang="less" scoped>
h2.l-text-component,
p.l-text-component {
  margin-bottom: 0;
}

button.l-text-component {
  padding: 5px 10px;
  cursor: pointer;
}

.l-text-component {
  // position: relative !important;
  box-sizing: border-box;
  white-space: pre-wrap;
}
</style>
