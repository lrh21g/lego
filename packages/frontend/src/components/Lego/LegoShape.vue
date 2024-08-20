<script setup lang="ts">
import { shapeComponentProps, shapeStylePropsNames } from './defaultProps'
import useComponentCommon from '@/hooks/useComponentCommon.ts'

const props = defineProps({
  ...shapeComponentProps,
})

const {
  styleProps,
  handleClick,
}: { styleProps: any, handleClick: () => void } = useComponentCommon(
  props,
  shapeStylePropsNames,
)
</script>

<template>
  <div
    :style="styleProps"
    class="l-shape-component"
    @click.prevent="handleClick"
  />
</template>
