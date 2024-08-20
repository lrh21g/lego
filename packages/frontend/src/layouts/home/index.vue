<script setup lang="ts"></script>

<template>
  <a-layout :style="{ background: '#fff' }">
    <a-layout-header class="home-header">
      <div class="header-title">
        <router-link to="/">
          乐高 lego
        </router-link>
      </div>
    </a-layout-header>
    <a-layout-content class="home-content">
      <router-view />
    </a-layout-content>
    <a-layout-footer>
      © lrh21g 版权所有 | 知足且上进，温柔而坚定。
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  color: #fff;
}
</style>
