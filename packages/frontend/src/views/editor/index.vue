<script setup lang="ts">
import { computed, ref } from 'vue'
import { pickBy } from 'lodash-es'
import {
  BuildOutlined,
  FieldStringOutlined,
  FileImageOutlined,
} from '@ant-design/icons-vue'

import HistoryArea from './HistoryArea.vue'
import InlineEdit from '@/components/InlineEdit.vue'
import UserProfile from '@/components/UserProfile.vue'
import ComponentList from '@/components/ComponentList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import EditGroup from '@/components/EditGroup.vue'
import LayerList from '@/components/LayerList.vue'
import PropsTable from '@/components/PropsTable/index.vue'
import LegoText from '@/components/Lego/LegoText.vue'
import LegoImage from '@/components/Lego/LegoImage.vue'
import LegoShape from '@/components/Lego/LegoShape.vue'

import { useEditorStore } from '@/store/modules/editor'

import initContextMenu from '@/plugins/contextMenu'
import initHotKeys from '@/plugins/hotKeys'

import type { ComponentData } from '@/store/modules/editor'
import type { AllComponentProps } from '@/components/Lego/defaultProps'

import defaultTextTemplates from '@/config/defaultTextTemplates'
import defaultImageTemplates from '@/config/defaultImageTemplates'
import defaultShapeTemplates from '@/config/defaultShapeTemplates'

initHotKeys()
initContextMenu()

const legoComponents = {
  LegoText,
  LegoImage,
  LegoShape,
}
enum SettingsPanelTabsKey {
  component = 'component',
  layer = 'layer',
  page = 'page',
}

const canvasFix = ref(false)
const editorStore = useEditorStore()
const components = computed(() => editorStore.components)
const currentElement = computed<ComponentData | null | any>(
  () => editorStore.getCurrentElement || null,
)
const page = computed<any>(() => editorStore.page)

function onInlineEditChange(newTitle: string) {
  editorStore.updatePage({ key: 'title', value: newTitle, isRoot: true })
}

function handlePageAttrChange(e: any) {
  editorStore.updatePage(e)
}

const settingsPanelActiveKey = ref(SettingsPanelTabsKey.component)
function handleSettingsPanelTabsChange(activeKey: SettingsPanelTabsKey) {
  settingsPanelActiveKey.value = activeKey
  if (activeKey === SettingsPanelTabsKey.page) {
    editorStore.setActive('')
  }
}
function handlePageContainerClick() {
  editorStore.setActive('')
  settingsPanelActiveKey.value = SettingsPanelTabsKey.page
}

function setActive(id: string) {
  editorStore.setActive(id)
  if (settingsPanelActiveKey.value !== SettingsPanelTabsKey.layer) {
    settingsPanelActiveKey.value = SettingsPanelTabsKey.component
  }
}

function handleAddComponentItem(component: ComponentData) {
  editorStore.addComponent(component)
}

function updatePosition(data: { left: number, top: number, id: string }) {
  const { id } = data

  // _.pickBy(object, [predicate=_.identity]) 创建一个对象，这个对象组成为从 object 中经 predicate 判断为真值的属性。predicate调用2个参数：(value, key)。
  // eg:
  // var object = { 'a': 1, 'b': '2', 'c': 3 };
  // _.pickBy(object, _.isNumber);
  // => { 'a': 1, 'c': 3 }
  const updatedData = pickBy<number>(data, (_, key) => key !== 'id')
  const keysArr = Object.keys(updatedData)
  const valuesArr = Object.values(updatedData).map(v => `${v}px`)

  editorStore.updateComponent({
    key: keysArr as keyof AllComponentProps | Array<keyof AllComponentProps>,
    value: valuesArr,
    id,
  })
}

function handleAttrsChange(e: any) {
  editorStore.updateComponent(e)
}

function handleLayerChange(e: any) {
  editorStore.updateComponent(e)
}

function handleLayerDrop(id: string, newIndex: number, oldIndex: number) {
  editorStore.updateComponentLayerLevel(id, newIndex, oldIndex)
}
</script>

<template>
  <a-layout class="editor-container">
    <a-layout-header class="editor-header-container">
      <div class="editor-header-left">
        <router-link to="/">
          <img
            alt="乐高 lego"
            src="@/assets/images/logo-simple.png"
            class="logo-img"
          >
        </router-link>
        <InlineEdit :value="page.title || ''" @change="onInlineEditChange" />
      </div>
      <a-menu
        :selectable="false"
        theme="dark"
        mode="horizontal"
        :style="{ height: '100%' }"
        class="editor-header-right"
      >
        <a-menu-item key="1">
          <a-button type="primary">
            预览和设置
          </a-button>
        </a-menu-item>
        <a-menu-item key="2">
          <a-button type="primary">
            保存
          </a-button>
        </a-menu-item>
        <a-menu-item key="3">
          <a-button type="primary">
            发布
          </a-button>
        </a-menu-item>
        <a-menu-item key="4" class="user-profile-menu">
          <UserProfile />
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout class="editor-content">
      <a-layout-sider width="300" class="components-panel">
        <a-tabs>
          <a-tab-pane key="text">
            <template #tab>
              <span>
                <FieldStringOutlined />
                文本
              </span>
            </template>
            <ComponentList
              type="text"
              :list="defaultTextTemplates"
              @on-item-click="handleAddComponentItem"
            />
          </a-tab-pane>
          <a-tab-pane key="image">
            <template #tab>
              <span>
                <FileImageOutlined />
                图片
              </span>
            </template>
            <ComponentList
              type="image"
              :list="defaultImageTemplates"
              @on-item-click="handleAddComponentItem"
            />
          </a-tab-pane>
          <a-tab-pane key="shape">
            <template #tab>
              <span>
                <BuildOutlined />
                形状
              </span>
            </template>
            <ComponentList
              type="shape"
              :list="defaultShapeTemplates"
              @on-item-click="handleAddComponentItem"
            />
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <HistoryArea />
          <div
            id="canvas-area"
            class="preview-list"
            :class="{ 'canvas-fix': canvasFix }"
          >
            <div
              class="page-container"
              :class="{ active: settingsPanelActiveKey === 'page' }"
              :style="page.props"
              @click.stop="handlePageContainerClick"
            >
              <EditWrapper
                v-for="componentItem in components"
                :id="componentItem.id"
                :key="componentItem.id"
                :hidden="componentItem.isHidden"
                :locked="componentItem.isLocked"
                :props="componentItem.props"
                :active="
                  componentItem.id === (currentElement && currentElement.id)
                "
                @set-active="setActive"
                @update-position="updatePosition"
              >
                <component
                  :is="legoComponents[componentItem.name]"
                  v-bind="componentItem.props"
                />
              </EditWrapper>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" class="settings-panel">
        <a-tabs
          v-model:activeKey="settingsPanelActiveKey"
          type="card"
          @change="handleSettingsPanelTabsChange"
        >
          <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
            <EditGroup
              v-if="currentElement && !currentElement.isLocked"
              :props="currentElement.props"
              @change="handleAttrsChange"
            />
            <div v-else>
              <a-empty>
                <template #description>
                  <p>该元素被锁定，无法编辑</p>
                </template>
              </a-empty>
            </div>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <LayerList
              :list="components"
              :selected-id="
                currentElement && currentElement.id ? currentElement.id : ''
              "
              @select="setActive"
              @change="handleLayerChange"
              @drop="handleLayerDrop"
            />
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置" class="page-setting-container">
            <PropsTable :props="page.props" @change="handlePageAttrChange" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
.editor-container {
  height: 100vh;
}

.editor-header-container {
  display: flex;
  justify-content: space-between;

  .editor-header-left {
    display: flex;

    .logo-img {
      margin-right: 20px;
    }

    .inline-edit-container {
      font-weight: bold;
      color: #fff;
    }
  }

  .editor-header-right {
    display: flex;
    flex: auto;
    justify-content: right;
  }
}

.components-panel {
  padding: 10px 20px;
  background: #fff;

  :deep(.ant-tabs-content) {
    height: calc(100vh - 144px);
    overflow: hidden auto;
  }
}

.preview-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 85vh;
  padding: 24px;
  margin: 0;
}

.preview-container .preview-list {
  position: fixed;
  min-width: 375px;
  min-height: 200px;
  max-height: 80vh;
  padding: 0;
  margin: 0;
  margin-top: 50px;
  overflow: hidden auto;
  background: #fff;
  border: 1px solid #efefef;
}

.page-container.active {
  border: 1px solid #1890ff;
}

.settings-panel {
  padding: 10px 0;
  background: #fff;

  :deep(.ant-tabs-content) {
    height: calc(100vh - 144px);
    overflow-y: auto;
  }

  .page-setting-container {
    padding: 16px;
  }
}
</style>
