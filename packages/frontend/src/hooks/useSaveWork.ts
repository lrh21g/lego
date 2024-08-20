import { computed, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'

import { useGlobalStore } from '@/store/modules/global'
import { useEditorStore } from '@/store/modules/editor'

function useSaveWork(disableSideEffects = false) {
  const route = useRoute()
  const globalStore = useGlobalStore()
  const editorStore = useEditorStore()

  const currentWorkId = route.params.id
  const saveIsLoading = computed(() => globalStore.isOpLoading('saveWork'))
  const components = computed(() => editorStore.components)
  const page = computed(() => editorStore.page)
  const isDirty = computed(() => editorStore.isDirty)

  const saveWork = () => {
    const { title, props, coverImg, desc, setting } = page.value
    const payload = {
      title,
      coverImg,
      desc,
      content: {
        components: components.value,
        props,
        setting,
      },
    }
    editorStore.saveWork({ data: payload, urlParams: { id: currentWorkId } })
  }

  if (!disableSideEffects) {
    // 自动保存
    let timer = 0
    onMounted(() => {
      timer = window.setInterval(() => {
        if (isDirty.value)
          saveWork()
      }, 1000 * 50)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })

    // 离开路由前提示
    onBeforeRouteLeave((to, from, next) => {
      if (isDirty.value) {
        Modal.confirm({
          title: '作品还未保存，是否保存？',
          okText: '保存',
          okType: 'primary',
          cancelText: '不保存',
          onOk: async () => {
            await saveWork()
            next()
          },
          onCancel: () => {
            next()
          },
        })
      }
      else {
        next()
      }
    })
  }

  return {
    saveWork,
    saveIsLoading,
  }
}

export default useSaveWork
