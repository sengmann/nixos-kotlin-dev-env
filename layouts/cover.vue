<template>
  <div class="slidev-layout cover" :style="style">
    <div class="my-auto flex flex-col items-center w-full">
      <slot />
      <img
        src="/assets/images/tcc-logo_2.svg"
        class="max-h-12"
        alt="TheCodeCampus Logo"
      />
      <img v-if="coverLogoUrl" :src="coverLogoUrl" alt="" class="max-h-12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layout-helper";

const { coverBackgroundUrl } = defineProps<{
  coverBackgroundUrl?: string;
  coverBackgroundSource?: string;
  coverBackgroundSourceUrl?: string;
  coverLogoUrl?: string;
  coverDate?: string | Date;
}>();

const style = computed(() => handleBackground(coverBackgroundUrl, true));
</script>
