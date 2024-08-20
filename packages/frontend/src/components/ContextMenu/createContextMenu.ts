import { createVNode, render } from 'vue'
import ContextMenu from './index.vue'

export interface ActionItem {
  action: (cid?: string) => void // 执行函数
  text: string // 菜单项文本
  shortcut: string // 指定快捷键
}

/**
 * 创建上下文菜单
 *
 * @param actions 菜单项列表
 * @param triggerClass 触发菜单的元素类名，默认为 'edit-wrapper'
 * @returns 销毁菜单的函数
 */
function createContextMenu(
  actions: ActionItem[],
  triggerClass = 'edit-wrapper',
) {
  const container = document.createElement('div')
  const options = { actions, triggerClass }
  const vm = createVNode(ContextMenu, options)

  render(vm, container)
  document.body.appendChild(container)

  return () => {
    render(null, container)
    document.body.removeChild(container)
  }
}

export default createContextMenu
