<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

import LegoText from './Lego/LegoText.vue'
import LegoImage from './Lego/LegoImage.vue'
import LegoShape from './Lego/LegoShape.vue'
import StyleUploader from './StyledUploader/index.vue'

import type {
  ImageComponentProps,
  ShapeComponentProps,
  TextComponentProps,
} from './Lego/defaultProps'
import type { ComponentData } from '@/store/modules/editor'

export type ComponentPropsType = 'text' | 'image' | 'shape'
export type ComponentPropsList =
  | TextComponentProps[]
  | ImageComponentProps[]
  | ShapeComponentProps[]
const props = defineProps<{
  type: ComponentPropsType
  list: ComponentPropsList
}>()
const emits = defineEmits(['onItemClick'])

function propsTypeToComponentName() {
  switch (props.type) {
    case 'text':
      return 'LegoText'
    case 'image':
      return 'LegoImage'
    case 'shape':
      return 'LegoShape'
  }
}

export type ComponentProps =
  | TextComponentProps
  | ImageComponentProps
  | ShapeComponentProps
function onItemClick(props: ComponentProps) {
  const componentData: ComponentData = {
    name: propsTypeToComponentName(),
    id: uuidv4(),
    props,
  }
  emits('onItemClick', componentData)
}
</script>

<template>
  <StyleUploader v-if="props.type === 'image'" />
  <div
    class="create-component-list"
    :class="{ 'image-list': props.type === 'image' }"
  >
    <div
      v-for="(item, index) in props.list"
      :key="index"
      class="component-item"
      :class="{ 'item-image': props.type === 'image' }"
      @click="onItemClick(item)"
    >
      <LegoText v-if="props.type === 'text'" v-bind="item" />
      <LegoImage
        v-if="props.type === 'image'"
        v-bind="item"
        class="inside-component"
      />
      <LegoShape v-if="props.type === 'shape'" v-bind="item" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-item {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  cursor: pointer;

  .inside-component {
    width: 100px !important;
  }
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  margin-right: -10px;

  .item-image {
    max-height: 150px;
    margin-right: 20px;
    object-fit: contain;
  }
}

.component-item > * {
  position: static !important;
}
</style>
