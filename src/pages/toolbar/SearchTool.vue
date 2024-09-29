<script setup lang="ts">
function onReplace() {}
</script>
<template>
  <n-layout-sider width="100%" class="h-full p4" :native-scrollbar="false">
    <n-space vertical>
      <!-- 搜索框 -->
      <n-input placeholder="search" />
      <div class="flex-start-center">
        <!-- 替换框 -->
        <n-input placeholder="replace" />
        <span class="ml3 i-codicon-replace-all" @click="onReplace" />
      </div>
      <div>include</div>
      <!-- 包含框 -->
      <n-input placeholder="*.ts, src/**/include" />
      <div>exclude</div>
      <!-- 排除框 -->
      <n-input placeholder="*.ts, src/**/include" />
    </n-space>
  </n-layout-sider>
</template>
