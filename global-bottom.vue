<template>
  <footer
    v-if="$nav.currentLayout === 'cover'"
    class="absolute bottom-0 w-full"
  >
    <img src="/assets/images/Title_border.png" alt="" />
    <div
      class="h-[48px] w-full absolute bottom-0 flex justify-between items-center place-items-center"
    >
      <div class="text-white ml-3 text-l">Weiter.Entwickeln</div>
      <img class="mr-3" src="/assets/images/PoweredByW11K.svg" />
    </div>
  </footer>
</template>
