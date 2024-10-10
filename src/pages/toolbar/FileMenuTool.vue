<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import type { TreeOverrideNodeClickBehaviorReturn, TreeOption } from "naive-ui";
const projectStore = useProjectStore();
const expandedKeys = ref<string[]>([]);

watch(
  () => projectStore.selectProjectName,
  () => {
    expandedKeys.value = [];
  }
);

onMounted(projectStore.getProjectList);

function override({ option }: { option: TreeOption }): TreeOverrideNodeClickBehaviorReturn {
  if (option.children) {
    return "toggleExpand";
  }
  return "default";
}

function nodeProps({ option }: { option: TreeOption }) {
  return {
    async onClick() {
      if (!option.children && !option.disabled) {
        option.type === "file" && (await onOpenFile(option.key as string));
      }
    },
  };
}
async function onOpenFile(path: string) {
  projectStore.getFileContent(path);
  projectStore.addFileTab(path);
}

function onSaveFileAll() {
  if (projectStore.modifiedFiles.size) {
    projectStore.saveAllFile();
  }
}

function onSaveFile() {
  const filepath = !!projectStore.selectFileTab && projectStore.modifiedFiles.has(projectStore.selectFileTab);

  if (filepath) {
    projectStore.saveCurrentFile();
  }
}
</script>
<template>
  <n-layout-sider width="100%" style="height: 100%" :native-scrollbar="false">
    <!-- 文件操作按钮 -->
    <n-layout-header bordered class="flex-end-center p2 space-x-2 sticky top-0 z-9999">
      <div bg-hover title="New File" i="icon-park-outline-file-addition-one" />
      <div bg-hover title="New Folder" i="codicon-new-folder" />
      <div bg-hover title="Save All" i="codicon-save-all" @click="onSaveFileAll" />
      <div bg-hover title="Save File" i="codicon-save" @click="onSaveFile" />
    </n-layout-header>
    <!-- 文件列表树 -->
    <n-tree
      ref="treeInstRef"
      virtual-scroll
      style="height: calc(100% - 128px)"
      :data="projectStore.fileMenuOptions"
      :node-props="nodeProps"
      :override-default-node-click-behavior="override"
    />
  </n-layout-sider>
</template>
