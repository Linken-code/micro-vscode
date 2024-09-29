import { defineStore } from "pinia";
import type { MenuItem } from "~/types";
import type { MenuOption } from "naive-ui";
import { handleFileMenu } from "~/lib/handle/file";
import { createInvoke } from "~/lib/utils/api";

const FileContentMap = new Map<string, string>();
const FileContentChangeMap = new Map<string, string>();

export function clearFileContentHistory(fullPath: string) {
  FileContentMap.delete(fullPath);
  FileContentChangeMap.delete(fullPath);
}

export const useProjectStore = defineStore("useProjectStore", () => {
  const selectProjectName = ref("");
  const projectNameList = ref<string[]>([]);
  const fileMenuOptions = ref<MenuItem[]>([]);
  const projectMenuOptions = computed<MenuOption[]>(() => [
    {
      label: "Project",
      key: "project",
      children: projectNameList.value.map((label) => ({
        label,
        key: label,
      })),
    },
    {
      label: "Git Clone",
      key: "git_clone",
    },
  ]);
  const fileInfo = reactive({ path: "", content: "" });
  const fileTabs = ref<{ label: string; value: string }[]>([]);
  const selectFileTab = ref("");
  const modifiedFiles = ref<Set<string>>(new Set());
  const fileChangedCount = ref(0);
  //监听当前选择的项目
  watch(selectProjectName, async (name) => {
    const data = await getProjectFiles(name);
    fileMenuOptions.value = handleFileMenu(data, name) as any[];
    // 清除旧文件
    fileTabs.value = [];
    clearFileContent();
  });
  //监听当前文件内容
  watch(
    () => fileInfo.content,
    (newValue) => {
      if (!fileInfo.path) return;
      if (FileContentMap.has(fileInfo.path)) {
        const oldValue = FileContentMap.get(fileInfo.path);

        if (oldValue !== newValue) {
          modifiedFiles.value.add(fileInfo.path);
        }
      }

      if (fileInfo.path) FileContentChangeMap.set(fileInfo.path, newValue);
    },
    { immediate: true, deep: true }
  );
  //获取项目文件
  async function getProjectFiles(projectName: string) {
    const { status, data } = await createInvoke<string[]>("get_project_files", {
      name: projectName,
    });

    if (status === "ok") return data;
    else return [];
  }
  //获取项目列表
  async function getProjectList() {
    const { status, data } = await createInvoke<string[]>("get_projects");

    if (status === "ok") {
      projectNameList.value = data;
    }
  }

  function clearFileContent() {
    fileInfo.content = "";
    fileInfo.path = "";
  }
  //获取文件内容
  async function getFileContent(path: string) {
    let data = "";

    if (!FileContentMap.has(path) && !FileContentChangeMap.has(path)) {
      const result = await createInvoke<string>("read_file", {
        path,
      });

      if (result.status === "ok") {
        data = result.data;
        FileContentMap.set(path, result.data);
        FileContentChangeMap.set(path, result.data);
      } else {
        return;
      }
    } else {
      data = FileContentChangeMap.get(path) || FileContentMap.get(path) || "";
    }

    fileInfo.content = data;
    fileInfo.path = path;
  }
  //保存当前文件
  async function saveCurrentFile() {
    if (modifiedFiles.value.has(fileInfo.path)) {
      const { status } = await createInvoke("write_file", {
        path: fileInfo.path,
        content: fileInfo.content,
      });

      if (status === "ok") {
        FileContentMap.set(fileInfo.path, fileInfo.content);
        modifiedFiles.value.delete(fileInfo.path);
        fileChangedCount.value++;
      }
    }
  }
  //不保存文件
  function notSaveCurrentFile() {
    modifiedFiles.value.delete(fileInfo.path);

    if (FileContentChangeMap.has(fileInfo.path)) {
      FileContentChangeMap.delete(fileInfo.path);
    }
  }
  //保存全部文件
  function saveAllFile() {
    const list = [...modifiedFiles.value]
      .filter((path) => FileContentChangeMap.has(path))
      .map((path) => {
        return createInvoke("write_file", {
          path: path,
          content: FileContentChangeMap.get(path),
        });
      });

    Promise.all(list).then(() => {
      modifiedFiles.value.forEach((path) => {
        if (FileContentChangeMap.has(path)) FileContentMap.set(path, FileContentChangeMap.get(path)!);
      });
      modifiedFiles.value.clear();
    });
  }
  //新增文件标签栏
  function addFileTab(value: string) {
    if (value && fileTabs.value.findIndex((item) => item.value === value) === -1) {
      const label = value.split("/").pop() || value;
      fileTabs.value.push({ label, value: value });
    }
    selectFileTab.value = value;
  }
  //关闭标签栏
  function closeFileTab(value: string) {
    const index = fileTabs.value.findIndex((item) => item.value === value);
    if (index === -1) return;

    // 关闭tab
    fileTabs.value.splice(index, 1);

    // 当前显示的tab
    const i = fileTabs.value.length === 1 ? 0 : index > 0 ? index - 1 : index + 1;
    const tab = fileTabs.value[i];
    if (tab) {
      selectFileTab.value = tab.value;
      getFileContent(tab.value);
    } else {
      clearFileContent();
    }
  }

  return {
    selectProjectName,
    projectNameList,
    fileMenuOptions,
    projectMenuOptions,
    fileInfo,
    fileTabs,
    selectFileTab,
    modifiedFiles,
    fileChangedCount,
    getProjectFiles,
    getProjectList,
    getFileContent,
    saveCurrentFile,
    notSaveCurrentFile,
    saveAllFile,
    addFileTab,
    closeFileTab,
  };
});
