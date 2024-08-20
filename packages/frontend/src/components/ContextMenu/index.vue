<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

import type { PropType } from 'vue'
import type { ActionItem } from './createContextMenu'

import { getParentElement } from '@/utils/helper'

const props = defineProps({
  // 右键菜单配置
  actions: {
    type: Array as PropType<ActionItem[]>,
    required: true,
  },
  // 触发右键菜单的 class 类名，默认为 .edit-wrapper
  triggerClass: {
    type: String,
    default: 'edit-wrapper',
  },
})

// 菜单容器 DOM
const menuRef = ref<HTMLElement | null>(null)
const componentId = ref('')

/**
 * 触发右键菜单
 *
 * @param e 触发事件的鼠标事件对象
 */
function triggerContextMenu(e: MouseEvent) {
  // 获取菜单容器 DOM
  const domElement = menuRef.value as HTMLElement
  // 获取触发右键菜单指定的 class 类名元素
  const wrapperElement = getParentElement(
    e.target as HTMLElement,
    props.triggerClass,
  )

  if (wrapperElement) {
    // 如果指定类名元素存在，则阻止默认事件，并显示菜单容器
    e.preventDefault()
    domElement.style.display = 'block'
    domElement.style.left = `${e.clientX}px`
    domElement.style.top = `${e.clientY}px`

    const cid = wrapperElement.dataset.componentId
    if (cid)
      componentId.value = cid
  }
}

function handleClick() {
  const domElement = menuRef.value as HTMLElement
  domElement.style.display = 'none'
}

onMounted(() => {
  document.addEventListener('contextmenu', triggerContextMenu)
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', triggerContextMenu)
  document.removeEventListener('click', handleClick)
})
</script>

<template>
  <div ref="menuRef" class="context-menu-component menu-container">
    <ul class="menu-list">
      <li
        v-for="(action, index) in actions"
        :key="index"
        class="menu-item"
        @click="action.action(componentId)"
      >
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.menu-container {
  position: absolute;
  z-index: 2000;
  display: none;
  background: #fff;
  border: 1px solid #ccc;
}

.menu-container .menu-list {
  box-sizing: border-box;
  width: 220px;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: rgb(0 0 0 / 65%);
}

.menu-container .menu-item {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  margin: 4px 0;
  line-height: 40px;
}

.menu-container .menu-item:hover {
  color: #3e7fff;
  background: #efefef;
}

.menu-item .item-shortcut {
  color: #ccc;
}
</style>
