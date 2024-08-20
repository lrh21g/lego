<script lang="ts">
import { reduce } from 'lodash-es'
import { computed, defineComponent } from 'vue'

import type { PropType, VNode } from 'vue'
import type { AllComponentProps } from '../Lego/defaultProps'

import RenderVnode from './RenderVnode'
import ColorPicker from './ColorPicker.vue'
import ImageProcessor from './ImageProcessor.vue'
import ShadowPicker from './ShadowPicker.vue'
import IconSwitch from './IconSwitch.vue'
import BackgroundProcessor from './BackgroundProcessor.vue'

import { mapPropsToForms } from '@/config/propsMap.tsx'

interface FormProps {
  component: string
  subComponent?: string
  value: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string | VNode, value: any }[]
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}

export default defineComponent({
  components: {
    RenderVnode,
    ColorPicker,
    ImageProcessor,
    ShadowPicker,
    IconSwitch,
    BackgroundProcessor,
  },
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, ctx) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof AllComponentProps
          const item = mapPropsToForms[newKey]

          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initialTransform,
              afterTransform,
            } = item
            const newItem: FormProps = {
              ...item,
              value: initialTransform ? initialTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) => {
                  ctx.emit('change', {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  })
                },
              },
            }
            result[newKey] = newItem
          }
          return result
        },
        {} as { [key: string]: FormProps },
      )
    })

    return {
      finalProps,
    }
  },
})
</script>

<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :id="`item-${key}`"
      :key="key"
      :class="{ 'no-text': !value.text }"
      class="prop-item"
    >
      <span v-if="value.text" class="label">{{ value.text }}</span>
      <div :class="`prop-component component-${value.component}`">
        <component
          :is="value.component"
          :[value.valueProp]="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options"
              :key="k"
              :value="option.value"
            >
              <RenderVnode :vnode="option.text" />
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.prop-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  width: 28%;
}

.prop-component {
  width: 70%;
}

.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}

/* stylelint-disable-next-line selector-id-pattern */
#item-fontWeight {
  margin-left: 28%;
}

/* stylelint-disable-next-line selector-id-pattern */
#item-backgroundImage {
  margin-bottom: 15px;
  cursor: pointer;
}

.component-a-select .ant-select {
  width: 150px;
}

.prop-component.component-shadow-picker,
.prop-component.component-image-processor,
.prop-component.component-background-processor {
  width: 100%;
}
</style>
./ImageProcessor.vue
