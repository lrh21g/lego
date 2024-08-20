import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, debounce } from 'lodash-es'
import { message } from 'ant-design-vue'
import type { AllComponentProps } from '@/components/Lego/defaultProps'

export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface ComponentData {
  // 元素的属性，属性请详见下面
  props: Partial<AllComponentProps>
  // id - uuid v4 生成
  id: string
  // 业务组件库： LegoText 、 LegoImage 、 LegoShape
  name: 'LegoText' | 'LegoImage' | 'LegoShape'
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
  // 图层名称
  layerName?: string
}

export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>
  value: string | string[]
  id: string
  isRoot?: boolean
}

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

export interface PageData {
  id?: number
  props?: PageProps
  title?: string
  desc?: string
  coverImg?: string
  uuid?: string
  setting?: { [key: string]: any }
  isTemplate?: boolean
  isHot?: boolean
  isNew?: boolean
  author?: string
  copiedCount?: number
  status?: number
  user?: {
    gender: string
    nickName: string
    picture: string
    userName: string
  }
}

export interface UpdatePageData {
  key: keyof PageData
  value: any
  isRoot?: boolean
  isSetting?: boolean
}

export interface ChannelProps {
  id: number
  name: string
  workId: number
  status: number
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的元素 uuid
  currentElement: string
  // 当然最后保存的时候,还有有一些项目信息
  page: PageData
  // 当前被复制的组件
  copiedComponent?: ComponentData
  // 当前操作的历史记录
  histories: HistoryProps[]
  // 当前历史记录的操作位置
  historyIndex: number
  // 开始更新时的缓存值
  cachedOldValues: any
  // 保存最多历史条目记录数
  maxHistoryNumber: number
  // 数据是否有修改
  isDirty: boolean
  // 当前 work 的 channels
  channels: ChannelProps[]
}

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  width: string
  height: string
}

export type AllFormProps = PageProps & AllComponentProps

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '375px',
  height: '560px',
}

// function pxToNumber(v: string) {
//   return v ? Number.parseInt(v) : 0
// }

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): EditorProps => ({
    page: {
      props: pageDefaultProps,
      title: 'page title',
    },
    components: [],
    currentElement: '',
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
    isDirty: false,
    channels: [],
  }),
  getters: {
    getCurrentElement(state) {
      return state.components.find(
        component => component.id === state.currentElement,
      )
    },
    getElement: state => (id: string) => {
      return state.components.find(
        component => component.id === (id || state.currentElement),
      )
    },
    checkUndoDisable(state) {
      if (state.histories.length === 0 || state.historyIndex === 0)
        return true

      return false
    },
    checkRedoDisable(state) {
      if (
        state.histories.length === 0
        || state.historyIndex === state.histories.length
        || state.historyIndex === -1
      ) {
        return true
      }

      return false
    },
  },
  actions: {
    setDirty() {
      this.isDirty = true
    },
    pushHistory(historyRecord: HistoryProps) {
      if (this.historyIndex !== -1) {
        this.histories = this.histories.splice(0, this.historyIndex)
        this.historyIndex = -1
      }

      if (this.histories.length < this.maxHistoryNumber) {
        this.histories.push(historyRecord)
      }
      else {
        this.histories.shift()
        this.histories.push(historyRecord)
      }
    },
    addComponent(component: ComponentData) {
      this.setDirty()

      component.layerName = `图层${this.components.length + 1}`
      this.components.push(cloneDeep(component))
      this.pushHistory({
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      })
    },
    setActive(currentId: string) {
      this.currentElement = currentId
    },
    modifyHistory(history: HistoryProps, type: 'undo' | 'redo') {
      const { componentId, data } = history
      const { key, oldValue, newValue } = data
      const newKey = key as
        | keyof AllComponentProps
        | Array<keyof AllComponentProps>
      const updatedComponent = this.components.find(
        component => component.id === componentId,
      )

      if (updatedComponent) {
        if (Array.isArray(newKey)) {
          newKey.forEach((keyName, index) => {
            updatedComponent.props[keyName]
              = type === 'undo' ? oldValue[index] : newValue[index]
          })
        }
        else {
          updatedComponent.props[newKey]
            = type === 'undo' ? oldValue : newValue
        }
      }
    },
    undo() {
      if (this.historyIndex === -1)
        this.historyIndex = this.histories.length - 1
      else this.historyIndex--

      const history = this.histories[this.historyIndex]
      const insertAt = (arr: any[], index: number, newItem: any) => {
        return [...arr.slice(0, index), newItem, ...arr.slice(index)]
      }

      switch (history.type) {
        case 'add':
          this.components = this.components.filter(
            component => component.id !== history.componentId,
          )
          break
        case 'delete':
          this.components = insertAt(
            this.components,
            history.index as number,
            history.data,
          )
          break
        case 'modify':
          this.modifyHistory(history, 'undo')
          break
        default:
          break
      }
    },
    redo() {
      if (this.historyIndex === -1)
        return

      const history = this.histories[this.historyIndex]
      switch (history.type) {
        case 'add':
          this.components.push(history.data)
          break
        case 'delete':
          this.components = this.components.filter(
            component => component.id !== history.componentId,
          )
          break
        case 'modify': {
          this.modifyHistory(history, 'redo')
          break
        }
        default:
          break
      }
      this.historyIndex++
    },
    copyComponent(id: string) {
      const currentComponent = this.getElement(id)
      if (currentComponent)
        this.copiedComponent = currentComponent
    },
    pasteCopiedComponent() {
      if (!this.copiedComponent)
        return

      this.setDirty()

      const clone = cloneDeep(this.copiedComponent)
      clone.id = uuidv4()
      clone.layerName = `${clone.layerName}副本`
      this.components.push(clone)

      message.success('已复制当前图层！', 1)

      const componentData: HistoryProps = {
        id: uuidv4(),
        componentId: clone.id,
        type: 'add',
        data: cloneDeep(clone),
      }
      this.pushHistory(componentData)
    },
    deleteComponent(id: string) {
      const currentComponent = this.components.find(
        component => component.id === id,
      )

      if (!currentComponent)
        return

      this.setDirty()

      const currentIndex = this.components.findIndex(
        component => component.id === id,
      )
      this.components = this.components.filter(
        component => component.id !== id,
      )

      const componentData: HistoryProps = {
        id: uuidv4(),
        componentId: currentComponent.id,
        type: 'delete',
        data: currentComponent,
        index: currentIndex,
      }
      this.pushHistory(componentData)

      message.success('已删除当前图层！', 1)
    },
    moveComponent(data: {
      direction: MoveDirection
      amount: number
      id: string
    }) {
      const currentComponent = this.components.find(
        component => component.id === data.id,
      )

      if (!currentComponent)
        return

      const oldTop = Number.parseInt(currentComponent.props.top || '0')
      const oldLeft = Number.parseInt(currentComponent.props.left || '0')
      const { direction, amount } = data
      switch (direction) {
        case 'Up': {
          const newValue = oldTop - amount
          if (newValue >= 0) {
            this.updateComponent({
              key: 'top',
              value: `${newValue}px`,
              id: data.id,
            })
          }
          break
        }
        case 'Down': {
          const newValue = `${oldTop + amount}px`
          this.updateComponent({
            key: 'top',
            value: `${newValue}px`,
            id: data.id,
          })
          break
        }
        case 'Left': {
          const newValue = oldLeft - amount
          if (newValue >= 0) {
            this.updateComponent({
              key: 'left',
              value: `${newValue}px`,
              id: data.id,
            })
          }
          break
        }
        case 'Right': {
          const newValue = oldLeft + amount
          const currentComponentPropsWidth = Number.parseInt(
            currentComponent.props?.width || '0',
          )
          const pagePropsWidth = Number.parseInt(this.page.props?.width || '0')
          if (newValue + currentComponentPropsWidth <= pagePropsWidth) {
            this.updateComponent({
              key: 'left',
              value: `${newValue}px`,
              id: data.id,
            })
          }
          break
        }
        default:
          break
      }
    },
    updateComponent({ key, value, id, isRoot }: UpdateComponentData) {
      const updatedComponent = this.components.find(
        component => component.id === (id || this.currentElement),
      )

      if (!updatedComponent)
        return

      if (updatedComponent?.isLocked)
        return

      this.setDirty()

      if (isRoot) {
        (updatedComponent as any)[key as string] = value
      }
      else {
        const oldValue = Array.isArray(key)
          ? key.map(key => updatedComponent.props[key])
          : updatedComponent.props[key]
        if (!this.cachedOldValues)
          this.cachedOldValues = oldValue

        const componentData: HistoryProps = {
          id: uuidv4(),
          componentId: id || this.currentElement,
          type: 'modify',
          data: { oldValue: this.cachedOldValues, newValue: value, key },
        }
        debounce(() => this.pushHistory(componentData), 1000)
        this.cachedOldValues = null

        if (Array.isArray(key) && Array.isArray(value)) {
          key.forEach((keyName, index) => {
            updatedComponent.props[keyName] = value[index]
          })
        }
        else if (typeof key === 'string' && typeof value === 'string') {
          updatedComponent.props[key] = value
        }
      }
    },
    updateComponentLayerLevel(id: string, newIndex: number, oldIndex: number) {
      const updatedComponent = this.components.find(
        component => component.id === (id || this.currentElement),
      )

      if (!updatedComponent)
        return

      this.components[newIndex] = this.components.splice(
        oldIndex,
        1,
        this.components[newIndex],
      )[0]
    },
    updatePage({ key, value, isRoot, isSetting }: UpdatePageData) {
      this.setDirty()

      if (isRoot) {
        this.page[key as keyof PageData] = value
      }
      else if (isSetting) {
        this.page.setting = {
          ...this.page.setting,
          [key]: value,
        }
      }
      else {
        if (this.page.props)
          this.page.props[key as keyof PageProps] = value
      }
    },
    // TODO : saveWork
    saveWork() {
      this.isDirty = false
    },
  },
})
