<script setup lang="ts">
import FileMenuTool from "./FileMenuTool.vue";
import SearchTool from "./SearchTool.vue";
import GitTool from "./git-tool/GitTool.vue";

const selectedTab = ref("file");
</script>

<template>
  <n-layout has-sider style="display: flex; height: 100%">
    <n-tabs v-model:value="selectedTab" key="card-left" type="line" animated placement="left" class="w-full h-full">
      <!-- 文件栏 -->
      <n-tab-pane name="file">
        <template #tab>
          <span title="Explorer" i="material-symbols-file-copy-outline-rounded" />
        </template>
        <FileMenuTool />
      </n-tab-pane>
      <!-- 搜索栏 -->
      <n-tab-pane name="search">
        <template #tab>
          <span title="Search" i="material-symbols-search" />
        </template>
        <SearchTool />
      </n-tab-pane>
      <!-- 源码栏 -->
      <n-tab-pane name="git" style="width: calc(100% - 51px)">
        <template #tab>
          <span title="Source Control" i="ion-ios-git-branch" />
        </template>
        <GitTool />
      </n-tab-pane>
    </n-tabs>
  </n-layout>
</template>

<style scoped>
:deep(.n-tab-pane) {
  padding-left: 0 !important;
}
</style>
