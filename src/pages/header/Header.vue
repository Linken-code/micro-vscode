<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import HeaderTool from "./HeaderTool.vue";
import HeaderMenu from "./HeaderMenu.vue";
import LayoutControl from "./LayoutControl.vue";
const projectStore = useProjectStore();

onMounted(projectStore.getProjectList);

async function onChangeProject(projectName: string) {
  projectStore.selectProjectName = projectName;
}
</script>
<template>
  <n-layout-header bordered>
    <!-- 窗口控制按钮 -->
    <LayoutControl />
    <div style="display: flex; justify-content: space-between">
      <!-- 左侧菜单项 -->
      <HeaderMenu @change="onChangeProject" />
      <!-- 右侧按钮 -->
      <HeaderTool />
    </div>
  </n-layout-header>
</template>
