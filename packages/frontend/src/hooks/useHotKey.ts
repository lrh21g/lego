import { onMounted, onUnmounted } from 'vue'
import hotKeys from 'hotkeys-js'

import type { KeyHandler } from 'hotkeys-js'

function useHotKey(keys: string, callback: KeyHandler) {
  onMounted(() => {
    hotKeys(keys, callback)
  })
  onUnmounted(() => {
    hotKeys.unbind(keys)
  })
}

export default useHotKey
