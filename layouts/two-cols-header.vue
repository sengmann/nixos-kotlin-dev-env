<!--
  Usage:
```md
---
layout: two-cols-header
---
This spans both
::left::
# Left
This shows on the left
::right::
# Right
This shows on the right
::bottom::
This shows at the bottom, aligned to the end (bottom) of the grid
```
-->

<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layout-helper";

const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
  dim: { type: Boolean },
  backgroundUrl: { type: String },
});

const style = computed(() => handleBackground(props.backgroundUrl, props.dim));
</script>

<template>
  <div
    class="slidev-layout two-cols-header w-full h-full"
    :class="layoutClass"
    :style="style"
  >
    <div class="col-header mb-3">
      <slot />
    </div>
    <div class="col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="col-right" :class="props.class">
      <slot name="right" />
    </div>
    <div class="col-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style scoped>
.two-cols-header {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: fit-content(100px) 1fr 1fr;
  @apply gap-2
}

.col-header {
  grid-area: 1 / 1 / 2 / 3;
}

.col-left {
  grid-area: 2 / 1 / 3 / 2;
}

.col-right {
  grid-area: 2 / 2 / 3 / 3;
}

.col-bottom {
  align-self: end;
  grid-area: 3 / 1 / 3 / 3;
}
</style>
