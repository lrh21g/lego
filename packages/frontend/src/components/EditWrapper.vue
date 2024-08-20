<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { pick } from 'lodash-es'

type ResizeDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
}

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  props: {
    type: Object,
  },
})
const emits = defineEmits(['setActive', 'updatePosition'])

const editWrapperRef = ref<HTMLElement | null>(null)
const styles = computed(() =>
  pick(props.props, ['position', 'top', 'left', 'width', 'height']),
)

function onItemClick(id: string) {
  emits('setActive', id)
}

let isMoving = false
const gap = { x: 0, y: 0 }

function calculateMovePosition(e: MouseEvent) {
  const canvasAreaDom = document.getElementById('canvas-area') as HTMLElement
  const canvasAreaDomWidth = canvasAreaDom.offsetWidth || 0

  const currentElement = editWrapperRef.value
  const currentElementWidth = currentElement?.offsetWidth || 0

  let left = e.clientX - gap.x - canvasAreaDom.offsetLeft
  let top
    = e.clientY - gap.y - canvasAreaDom.offsetTop + canvasAreaDom.scrollTop

  if (left + currentElementWidth > canvasAreaDomWidth) {
    left = canvasAreaDomWidth - currentElementWidth
  }
  if (e.clientX - gap.x < canvasAreaDom.offsetLeft) {
    left = 0
  }
  if (e.clientY - gap.y < canvasAreaDom.offsetTop) {
    top = 0
  }

  return { left, top }
}

function calculateSize(
  direction: ResizeDirection,
  e: MouseEvent,
  positions: OriginalPositions,
) {
  const canvasAreaDom = document.getElementById('canvas-area') as HTMLElement

  let { clientX, clientY } = e
  if (clientX < canvasAreaDom.offsetLeft) {
    clientX = canvasAreaDom.offsetLeft
  }
  if (clientX > canvasAreaDom.offsetLeft + canvasAreaDom.offsetWidth) {
    clientX = canvasAreaDom.offsetLeft + canvasAreaDom.offsetWidth
  }
  if (clientY < canvasAreaDom.offsetTop) {
    clientY = canvasAreaDom.offsetTop
  }

  const { left, right, top, bottom } = positions
  const leftWidth = right - clientX
  const rightWidth = clientX - left
  const bottomHeight = clientY - top
  const topHeight = bottom - clientY

  const leftOffset = clientX - canvasAreaDom.offsetLeft
  const topOffset = clientY - canvasAreaDom.offsetTop + canvasAreaDom.scrollTop

  switch (direction) {
    case 'top-left':
      return {
        width: leftWidth,
        height: topHeight,
        top: topOffset,
        left: leftOffset,
      }
    case 'top-right':
      return {
        width: rightWidth,
        height: topHeight,
        top: topOffset,
      }
    case 'bottom-left':
      return {
        width: leftWidth,
        height: bottomHeight,
        left: leftOffset,
      }
    case 'bottom-right':
      return {
        width: rightWidth,
        height: bottomHeight,
      }
    default:
      break
  }
}

function startResize(direction: ResizeDirection) {
  if (props.locked)
    return

  const currentElement = editWrapperRef.value as HTMLElement
  const { left, right, top, bottom } = currentElement.getBoundingClientRect()

  const handleMove = (e: MouseEvent) => {
    const size = calculateSize(direction, e, { left, right, top, bottom })
    const { style } = currentElement
    if (size) {
      style.width = `${size.width}px`
      style.height = `${size.height}px`

      if (size.left)
        style.left = `${size.left}px`

      if (size.top)
        style.top = `${size.top}px`
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)

    const size = calculateSize(direction, e, { left, right, top, bottom })
    emits('updatePosition', { ...size, id: props.id })

    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function startMove(e: MouseEvent) {
  if (props.locked)
    return

  const currentElement = editWrapperRef.value

  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()

    gap.x = e.clientX - left
    gap.y = e.clientY - top
  }

  const handleMove = (e: MouseEvent) => {
    const { left, top } = calculateMovePosition(e)
    isMoving = true
    if (currentElement) {
      currentElement.style.top = `${top}px`
      currentElement.style.left = `${left}px`
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    if (isMoving) {
      const { left, top } = calculateMovePosition(e)
      emits('updatePosition', { left, top, id: props.id })
      isMoving = false
    }
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <div
    ref="editWrapperRef"
    class="edit-wrapper"
    :style="styles"
    :data-component-id="id"
    :class="{ active, hidden }"
    @mousedown.prevent="startMove"
    @click.stop="onItemClick(id)"
  >
    <slot />
    <div class="resizers">
      <div class="resizer top-left" @mousedown.stop="startResize('top-left')" />
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      />
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      />
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      />
    </div>
  </div>
</template>

<style lang="less">
.edit-wrapper {
  box-sizing: content-box !important;
  padding: 0;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
}

.edit-wrapper > * {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
}

.edit-wrapper:hover {
  border: 1px dashed #ccc;
}

.edit-wrapper.hidden {
  display: none;
}

.edit-wrapper.active {
  user-select: none;
  // z-index: 1500;
  border: 1px solid #1890ff;
}

.edit-wrapper .resizers {
  display: none;
}

.edit-wrapper.active .resizers {
  display: block;
}

.edit-wrapper.active .resizers .resizer {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 3px solid #1890ff;
  border-radius: 50%;
}

.edit-wrapper .resizers .resizer.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.edit-wrapper .resizers .resizer.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.edit-wrapper .resizers .resizer.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
