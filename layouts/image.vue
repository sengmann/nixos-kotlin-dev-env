<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground } from '../layout-helper'

const props = defineProps({
  image: {
    type: String,
  },
  backgroundSize: {
    type: String,
    default: 'cover',
  },
  layoutClass: {
    type: String
  }
})

const style = computed(() => handleBackground(props.image, false, props.backgroundSize))
</script>

<template>
  <div 
     class="slidev-layout w-full h-full" 
     :class="layoutClass"
     :style="style"
     >
    <slot />
  </div>
</template>
