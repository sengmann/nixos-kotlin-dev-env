<template>
  <div class="flex flex-col items-center justify-items-center">
    <a :href="link" class="relative block hover:brightness-70" target="_blank">
      <img class="h-[250px] border-[2em] border-white" :src="img" />
      <p
        v-if="text"
        class="absolute inset-0 flex items-end justify-center text-black"
      >
        {{ text }}
      </p>
    </a>
    <a :href="socialLink" class="hover:brightness-70" target="_blank">
      <img class="mt-10" src="/assets/images/tcc-slides-followus.svg"
    /></a>
  </div>
</template>
<style scoped>
.slidev-layout {
  a {
    border: 0;
  }
  p {
    margin-bottom: 7px;
  }
}
</style>
<script setup lang="ts">
const { link, socialLink, text, img } = defineProps<{
  link: string;
  socialLink: string;
  text: string;
  img?: string;
}>();
</script>
