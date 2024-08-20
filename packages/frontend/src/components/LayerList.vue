<script lang="ts" setup>
import type { PropType } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

// @ts-expect-error: Unreachable code error
import {
  DragOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue'

import InlineEdit from './InlineEdit.vue'

import type { ComponentData } from '@/store/modules/editor'

const props = defineProps({
  list: {
    type: Array as PropType<ComponentData[]>,
    required: true,
  },
  selectedId: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['select', 'change', 'drop'])
// const layerList = computed(() => props.list.reverse())

function handleClick(id: string) {
  emits('select', id)
}

function handleChange(id: string, key: string, value: boolean) {
  const data = {
    id,
    key,
    value,
    isRoot: true,
  }
  emits('change', data)
}

function handleDraggableEnd(e: any) {
  const { data, newDraggableIndex, oldDraggableIndex } = e
  emits('drop', data.id, newDraggableIndex, oldDraggableIndex)
}
</script>

<template>
  <VueDraggable
    :model-value="props.list"
    :animation="150"
    ghost-class="ghost"
    handle=".handle"
    @end="handleDraggableEnd"
  >
    <div
      v-for="item in props.list"
      :key="item.id"
      class="layer-list-item"
      :class="{ active: item.id === props.selectedId }"
      @click="handleClick(item.id)"
    >
      <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
        <a-button
          shape="circle"
          @click.stop="handleChange(item.id, 'isHidden', !item.isHidden)"
        >
          <template v-if="item.isHidden" #icon>
            <EyeOutlined />
          </template>
          <template v-else #icon>
            <EyeInvisibleOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
        <a-button
          shape="circle"
          @click.stop="handleChange(item.id, 'isLocked', !item.isLocked)"
        >
          <template v-if="item.isLocked" #icon>
            <UnlockOutlined />
          </template>
          <template v-else #icon>
            <LockOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <InlineEdit
        class="handle edit-area"
        :value="item.layerName || ''"
        @change="
          (value) => {
            handleChange(item.id, 'layerName', value);
          }
        "
      />
      <a-tooltip title="拖动排序">
        <a-button shape="circle" class="handle">
          <template #icon>
            <DragOutlined />
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </VueDraggable>
</template>

<style lang="less" scoped>
.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}

.layer-list {
  padding: 0;
}

.layer-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
  transition: all 0.5s ease-out;
}

.layer-list-item.active {
  border: 1px solid #1890ff;
}

.layer-list-item.ghost {
  opacity: 0.5;
}

.layer-list-item:hover {
  background: #e6f7ff;
}

.layer-list-item > * {
  margin-right: 10px;
}

.layer-list-item button {
  font-size: 12px;
}

.layer-list-item .handle {
  margin-left: auto;
  cursor: move;
}

.layer-list-item .edit-area {
  max-width: 100%;
}
</style>
