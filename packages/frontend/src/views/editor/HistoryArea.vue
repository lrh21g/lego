<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  QuestionOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue'

import { useEditorStore } from '@/store/modules/editor'

import { hotKeysConfig } from '@/plugins/hotKeys'

const editorStore = useEditorStore()

const hotKeysModalOpen = ref(false)
const hotKeysTableColumns = [
  {
    title: '快捷键',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
  },
]
const hotKeysTableDataSource = hotKeysConfig.map(hotKeyItem => ({
  title: hotKeyItem.title,
  desc: hotKeyItem.desc,
}))

function hotKeysTip() {
  hotKeysModalOpen.value = true
}
function handleHotKeysModalOk() {
  hotKeysModalOpen.value = false
}

const undoIsDisabled = computed(() => editorStore.checkUndoDisable)
function undoHistory() {
  editorStore.undo()
}

const redoIsDisabled = computed(() => editorStore.checkRedoDisable)
function redoHistory() {
  editorStore.redo()
}
</script>

<template>
  <div class="history-area">
    <div class="operation-list">
      <a-space>
        <a-tooltip>
          <template #title>
            快捷键提示
          </template>
          <a-button shape="circle" @click="hotKeysTip">
            <template #icon>
              <QuestionOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip>
          <template #title>
            撤销
          </template>
          <a-button
            shape="circle"
            :disabled="undoIsDisabled"
            @click="undoHistory"
          >
            <template #icon>
              <UndoOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip>
          <template #title>
            重做
          </template>
          <a-button
            shape="circle"
            :disabled="redoIsDisabled"
            @click="redoHistory"
          >
            <template #icon>
              <RedoOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </a-space>
    </div>
  </div>
  <a-modal
    v-model:open="hotKeysModalOpen"
    title="快捷操作"
    :footer="null"
    @ok="handleHotKeysModalOk"
  >
    <a-table
      :data-source="hotKeysTableDataSource"
      :columns="hotKeysTableColumns"
      size="middle"
    />
  </a-modal>
</template>

<style lang="less" scoped>
.history-area {
  position: absolute;
  right: 0;
  z-index: 500;
}
</style>
