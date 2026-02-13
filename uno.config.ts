import presetWind4 from "@unocss/preset-wind4";
import { defineConfig } from "unocss";

export default defineConfig({
  presets: [presetWind4],
  safelist: [
    "i-vscode-icons:file-type-nix",
    "i-vscode-icons:file-type-light-toml",
    "i-vscode-icons:file-type-docker2",
    "i-vscode-icons:file-type-light-json",
  ],
});
