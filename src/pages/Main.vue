<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";
import { useProjectStore } from "../stores/project";
import LayoutHeader from "./header/Header.vue";
import LayoutFooter from "./Footer.vue";
import LayoutToolbar from "./toolbar/Toolbar.vue";
import LayoutContent from "./content/Content.vue";

const isDark = useDark();
const theme = computed(() => (isDark.value ? darkTheme : lightTheme));
const projectStore = useProjectStore();

onMounted(projectStore.getProjectList);
</script>

<template>
  <n-config-provider :theme="theme" style="height: 100%">
    <n-message-provider>
      <n-modal-provider>
        <n-dialog-provider>
          <n-layout style="height: 100%">
            <!-- 导航头 -->
            <LayoutHeader />
            <n-layout has-sider style="height: calc(100% - 108px)">
              <n-split direction="horizontal" style="height: 100%" :default-size="0.28" :resize-trigger-size="2" :max="0.75" :min="0.28">
                <template #1>
                  <!-- 侧边工具栏 -->
                  <LayoutToolbar />
                </template>
                <template #2>
                  <!-- 代码编辑区 -->
                  <LayoutContent />
                </template>
              </n-split>
            </n-layout>
            <!-- 底部信息栏 -->
            <LayoutFooter />
          </n-layout>
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>
