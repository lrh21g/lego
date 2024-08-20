<script lang="ts" setup>
import type { PropType } from 'vue'
import type { TemplateProps } from '@/store/modules/templates'

defineProps({
  list: {
    type: Array as PropType<TemplateProps[]>,
    required: true,
  },
})
</script>

<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col v-for="item in list" :key="item.id" :span="6" class="poster-item">
        <router-link :to="{ name: 'template', params: { id: item.id } }">
          <a-card hoverable>
            <template #cover>
              <img v-if="item.coverImg" :src="item.coverImg">
              <img
                v-else
                src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"
              >
              <div class="hover-item">
                <a-button size="large" type="primary">
                  使用该模版创建
                </a-button>
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template #description>
                <div class="description-detail">
                  <span>作者：{{ item.author }}</span>
                  <span class="user-number">{{ item.copiedCount }}</span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
          <div class="tag-list">
            <a-tag v-if="item.isHot" color="red">
              HOT
            </a-tag>
            <a-tag v-if="item.isNew" color="green">
              NEW
            </a-tag>
          </div>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
.poster-item {
  position: relative;
  margin-bottom: 20px;
}

.poster-item .ant-card {
  border-radius: 12px;
}

.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}

.poster-item .ant-card-cover {
  position: relative;
  height: 390px;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.poster-item .ant-card-cover img {
  width: 100%;
  transition: all ease-in 0.2s;
}

.poster-item .ant-card-cover .hover-item {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 80%);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.poster-item .ant-card-hoverable {
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 10%);
}

.poster-item .ant-card-body {
  padding: 0;
}

.poster-item .ant-card-meta {
  margin: 0;
}

.poster-item .ant-card-meta-title {
  padding: 10px 12px;
  margin-bottom: 0 !important;
  color: #333;
  border-bottom: 1px solid #f2f2f2;
}

.description-detail {
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  color: #999;
}

.user-number {
  font-weight: bold;
}

.poster-title {
  height: 70px;
}

.poster-title h2 {
  margin-bottom: 0;
}

.poster-item:hover .hover-item {
  display: flex;
}

.poster-item:hover img {
  transform: scale(1.25);
}

.barcode-container img {
  border-radius: 0;
}
</style>
