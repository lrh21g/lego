<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  value: {
    type: String,
  },
  colors: {
    type: Array as PropType<string[]>,
    default: () => [
      '#ffffff',
      '#f5222d',
      '#fa541c',
      '#fadb14',
      '#52c41a',
      '#1890ff',
      '#722ed1',
      '#8c8c8c',
      '#000000',
      '',
    ],
  },
})
const emits = defineEmits(['change'])

function onChange(color: string) {
  emits('change', color)
}
</script>

<template>
  <div class="lego-color-picker">
    <div class="native-color-container">
      <input
        type="color"
        :value="value"
        @input="(event) => onChange((event.target as HTMLInputElement)?.value)"
      >
    </div>
    <ul class="picked-color-list">
      <li
        v-for="(item, key) in colors"
        :key="key"
        :class="`item-${key}`"
        @click.prevent="onChange(item)"
      >
        <div
          v-if="item.startsWith('#')"
          :style="{ backgroundColor: item }"
          class="color-item"
        />
        <div v-else class="color-item transparent-back" />
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.lego-color-picker {
  display: flex;
}

.native-color-container {
  width: 40%;
}

.native-color-container input[type='color'] {
  width: 100%;
  height: 50px;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.picked-color-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 60%;
  padding: 0 0 0 5px;
  margin: 0;
  list-style-type: none;
}

.picked-color-list li {
  flex: 1;
  width: 20%;
  min-width: 20%;
  max-width: 20%;
}

.color-item {
  width: 20px;
  height: 20px;
  padding: 3px;
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.transparent-back {
  background: url('~@/assets/images/transparent.png') no-repeat;
}
</style>
