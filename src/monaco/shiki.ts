import type { HighlighterGeneric } from "shiki/core";
import { createHighlighter } from "shiki";
import type { BundledLanguage } from "shiki/langs";
import type { BundledTheme } from "shiki/themes";
import langVue from "shiki/langs/vue.mjs";
import themeDark from "shiki/themes/vitesse-dark.mjs";
import themeLight from "shiki/themes/vitesse-light.mjs";

let highlighter: Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> | undefined;

export async function getShiki() {
  if (highlighter) return highlighter;

  const darkColors = (themeDark as any).colors as Record<string, string>;
  darkColors["editor.background"] = "#00000000";
  darkColors["editor.lineHighlightBackground"] = "#00000000";

  // 创建一个可复用的语法高亮器
  highlighter = createHighlighter({
    langs: [langVue as any],
    themes: [themeLight as any, themeDark as any],
  });
  return highlighter;
}
