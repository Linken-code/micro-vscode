<script setup lang="ts">
import * as monaco from "monaco-editor-core/esm/vs/editor/editor.api";
import { shikiToMonaco } from "@shikijs/monaco";
import { initMonaco } from "../monaco/setup";
import { getShiki } from "../monaco/shiki";

const props = defineProps<{
  modelValue: string;
  filepath: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "change", value: string): void;
  (event: "save", value: string): void;
}>();

initMonaco();

const el = ref<HTMLDivElement>();

const colorMode = useColorMode();
const models = new Map<string, monaco.editor.ITextModel>();

const language = computed(() => {
  const ext = props.filepath?.split(".").pop() || "";
  switch (ext) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "css":
      return "css";
    case "json":
      return "json";
    case "vue":
      return "vue";
    case "html":
      return "html";
    case "rs":
      return "rust";
    case "swift":
      return "swift";
    default:
      return "plaintext";
  }
});
const theme = computed(() => (colorMode.value === "dark" ? "vitesse-dark" : "vitesse-light"));

function getModel(filepath: string) {
  let model: monaco.editor.ITextModel;
  if (!models.has(filepath)) {
    model = monaco.editor.createModel(props.modelValue, language.value, monaco.Uri.file(props.filepath));
    models.set(filepath, model);
  } else {
    model = models.get(filepath)!;
  }
  model.setValue(props.modelValue);
  return model;
}

watch(
  () => el.value,
  async (value) => {
    if (!value) return;

    const shiki = await getShiki();
    shikiToMonaco(shiki, monaco);

    const editor = monaco.editor.create(value, {
      model: getModel(props.filepath),
      theme: theme.value,
      fontSize: 14,
      bracketPairColorization: {
        enabled: false,
      },
      glyphMargin: false,
      automaticLayout: true,
      folding: false,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      fontFamily: "DM Mono, monospace",
      minimap: {
        enabled: false,
      },
      padding: {
        top: 8,
      },
      overviewRulerLanes: 0,
      fixedOverflowWidgets: true,
    });

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      emit("update:modelValue", value);
      emit("change", value);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const value = editor.getValue();
      emit("save", value);
    });

    watch(
      () => props.filepath,
      () => {
        editor.setModel(getModel(props.filepath));
      }
    );

    watch(
      () => props.modelValue,
      (value) => {
        if (value === editor.getValue()) return;
        const selections = editor.getSelections();
        const model = getModel(props.filepath);
        model.setValue(value);
        if (selections) editor.setSelections(selections);
      }
    );

    watch(theme, () => monaco.editor.setTheme(theme.value));
  }
);
</script>

<template>
  <div ref="el" style="width: 100%; height: 100%" />
</template>
