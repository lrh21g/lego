import { computed } from 'vue'
import type { HotkeysEvent, KeyHandler } from 'hotkeys-js'

import { useEditorStore } from '@/store/modules/editor'
import useHotKey from '@/hooks/useHotKey'

const editorStore = useEditorStore()

function wrap(callback: KeyHandler) {
  const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    callback(e, event)
  }
  return wrapperFn
}

const currentId = computed(() => editorStore.currentElement)

export const hotKeysConfig = [
  {
    hotkey: 'ctrl+c, command+c',
    title: '⌘C / Ctrl+C',
    desc: '拷贝图层',
    action: () => {
      editorStore.copyComponent(currentId.value)
    },
  },
  {
    hotkey: 'ctrl+v, command+v',
    title: '⌘V / Ctrl+V',
    desc: '粘贴图层',
    action: () => {
      editorStore.pasteCopiedComponent()
    },
  },
  {
    hotkey: 'backspace, delete',
    title: 'Backspace / Delete',
    desc: '删除图层',
    action: () => {
      editorStore.deleteComponent(currentId.value)
    },
  },
  {
    hotkey: 'esc',
    title: 'ESC',
    desc: '取消选中',
    action: () => {
      editorStore.setActive('')
    },
  },
  {
    hotkey: 'ctrl+z, command+z',
    title: '⌘Z / Ctrl+Z',
    desc: '撤销',
    action: () => {
      editorStore.undo()
    },
  },
  {
    hotkey: 'ctrl+shift+z, command+shift+z',
    title: '⌘⇧Z / Ctrl+Shift+Z',
    desc: '重做',
    action: () => {
      editorStore.redo()
    },
  },
  {
    hotkey: 'up',
    title: '↑',
    desc: '向上移动 1 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Up',
        amount: 1,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'down',
    title: '↓',
    desc: '向下移动 1 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Down',
        amount: 1,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'left',
    title: '←',
    desc: '向左移动 1 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Left',
        amount: 1,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'right',
    title: 'right',
    desc: '→',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Right',
        amount: 1,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'shift+up',
    title: 'Shift+↑',
    desc: '向上移动 10 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Up',
        amount: 10,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'shift+down',
    title: 'Shift+↓',
    desc: '向下移动 10 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Down',
        amount: 10,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'shift+left',
    title: 'Shift+←',
    desc: '向左移动 10 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Left',
        amount: 10,
        id: currentId.value,
      })
    }),
  },
  {
    hotkey: 'shift+right',
    title: 'Shift+→',
    desc: '向右移动 10 像素',
    action: wrap(() => {
      editorStore.moveComponent({
        direction: 'Right',
        amount: 10,
        id: currentId.value,
      })
    }),
  },
]

export default function initHotKeys() {
  hotKeysConfig.forEach(({ hotkey, action }) => {
    useHotKey(hotkey, action)
  })

  // const currentId = computed(() => editorStore.currentElement)
  // useHotKey('ctrl+c, command+c', () => {
  //   editorStore.copyComponent(currentId.value)
  // })
  // useHotKey('ctrl+v, command+v', () => {
  //   editorStore.pasteCopiedComponent()
  // })
  // useHotKey('backspace, delete', () => {
  //   editorStore.deleteComponent(currentId.value)
  // })
  // useHotKey('esc', () => {
  //   editorStore.setActive('')
  // })
  // useHotKey('up', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Up', amount: 1, id: currentId.value })
  // }))
  // useHotKey('down', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Down', amount: 1, id: currentId.value })
  // }))
  // useHotKey('left', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Left', amount: 1, id: currentId.value })
  // }))
  // useHotKey('right', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Right', amount: 1, id: currentId.value })
  // }))
  // useHotKey('shift+up', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Up', amount: 10, id: currentId.value })
  // }))
  // useHotKey('shift+down', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Down', amount: 10, id: currentId.value })
  // }))
  // useHotKey('shift+left', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Left', amount: 10, id: currentId.value })
  // }))
  // useHotKey('shift+right', wrap(() => {
  //   editorStore.moveComponent({ direction: 'Right', amount: 10, id: currentId.value })
  // }))
}
