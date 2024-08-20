<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
const isLogin = computed(() => userStore.isLogin)
const userData = computed(() => userStore.data)

function createDesign() {
  const id = 'test_123456'
  message.success('创建作品成功', 2, () => {
    router.push(`/editor/${id}`)
  })
}
function logout() {
  message.success('登出成功, 2秒后跳转到首页', 2, () => {
    router.push('/')
  })
}
</script>

<template>
  <router-link v-if="!isLogin" to="/login">
    <a-button type="primary" shape="round" class="user-profile-component">
      登录
    </a-button>
  </router-link>
  <div v-else class="user-profile-dropdown">
    <a-dropdown-button shape="round">
      <router-link to="/setting">
        {{ userData.nickName }}
      </router-link>
      <template #overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="createDesign">
            创建作品
          </a-menu-item>
          <a-menu-item key="1">
            <router-link to="/works">
              我的作品
            </router-link>
          </a-menu-item>
          <a-menu-item key="2" @click="logout">
            登出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>
