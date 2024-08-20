import { onMounted, onUnmounted } from 'vue'

function useKeyPress(targetKey: string, callback: () => void) {
  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey)
      callback()
  }

  onMounted(() => {
    document.addEventListener('keydown', keydownHandler)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', keydownHandler)
  })
}

export default useKeyPress
