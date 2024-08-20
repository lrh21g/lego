import { onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '@/store/modules/editor'

import type { ActionItem } from '@/components/ContextMenu/createContextMenu'

import createContextMenu from '@/components/ContextMenu/createContextMenu'

const editorStore = useEditorStore()

const defaultActions: ActionItem[] = [
  {
    shortcut: '⌘C / Ctrl+C',
    text: '拷贝图层',
    action: (cid) => {
      editorStore.copyComponent(cid || '')
    },
  },
  {
    shortcut: '⌘V / Ctrl+V',
    text: '粘贴图层',
    action: (_cid) => {
      editorStore.pasteCopiedComponent()
    },
  },
  {
    shortcut: 'Backspace / Delete',
    text: '删除图层',
    action: (cid) => {
      editorStore.deleteComponent(cid || '')
    },
  },
  {
    shortcut: 'ESC',
    text: '取消选中',
    action: () => {
      editorStore.setActive('')
    },
  },
]

// const settingsActions: ActionItem[] = [
//   {
//     shortcut: 'Ctrl+C',
//     text: '复制配置',
//     action: () => {},
//   },
// ]

function initContextMenu() {
  let destroyDefaultActions: () => void
  // let destroySettingsActions: () => void

  onMounted(() => {
    destroyDefaultActions = createContextMenu(defaultActions)
    // destroySettingsActions = createContextMenu(settingsActions, 'settings-panel')
  })

  onUnmounted(() => {
    destroyDefaultActions()
    // destroySettingsActions()
  })
}

export default initContextMenu
