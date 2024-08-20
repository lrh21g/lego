<script lang="ts" setup>
import { computed, ref } from 'vue'
import { difference } from 'lodash-es'

import type { PropType } from 'vue'
import type { AllComponentProps } from './Lego/defaultProps'

import PropsTable from './PropsTable/index.vue'

export interface GroupProps {
  text: string
  items: string[]
}

const props = defineProps({
  props: {
    type: Object as PropType<AllComponentProps>,
    required: true,
  },
  groups: {
    type: Array as PropType<GroupProps[]>,
    default: (): GroupProps[] => [
      {
        text: '尺寸',
        items: [
          'height',
          'width',
          'paddingLeft',
          'paddingRight',
          'paddingTop',
          'paddingBottom',
        ],
      },
      {
        text: '边框',
        items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius'],
      },
      {
        text: '阴影与透明度',
        items: ['opacity', 'boxShadow'],
      },
      {
        text: '位置',
        items: ['left', 'top'],
      },
      {
        text: '事件功能',
        items: ['actionType', 'url'],
      },
    ],
  },
})
const emits = defineEmits(['change'])

const currentKey = ref('item-0')
const newGroups = computed(() => {
  const allNormalProps = props.groups.reduce(
    (prev, curr) => [...prev, ...curr.items],
    [] as string[],
  )

  // _.difference(array, [values]) 创建一个具有唯一 array 值的数组，每个值不包含在其他给定的数组中。（注：即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）
  // eg:
  // _.difference([3, 2, 1], [4, 2]);
  // => [3, 1]
  const specialProps = difference(Object.keys(props.props), allNormalProps)

  return [
    {
      text: '基本属性',
      items: specialProps,
    },
    ...props.groups,
  ]
})
const editGroups = computed(() => {
  return newGroups.value.map((group) => {
    const propsMap = {} as AllComponentProps
    group.items.forEach((item) => {
      const key = item as keyof AllComponentProps
      propsMap[key] = props.props[key]
    })

    return { ...group, props: propsMap }
  })
})

function handleChange(e: any) {
  emits('change', e)
}
</script>

<template>
  <a-collapse v-model:activeKey="currentKey">
    <a-collapse-panel
      v-for="(item, index) in editGroups"
      :key="`item-${index}`"
      :header="item.text"
    >
      <PropsTable :props="item.props" @change="handleChange" />
    </a-collapse-panel>
  </a-collapse>
</template>
