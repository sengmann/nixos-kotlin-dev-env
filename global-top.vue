<template>
  <header
    v-if="$nav.currentLayout !== 'cover'"
    class="absolute top-0 left-0 right-0 z-10"
  >
    <div class="flex justify-between items-center mt-2">
      <img class="ml-4 h-4" src="/assets/images/tcc-logo_2.svg" />
      <div class="mr-4 bold text-xs">Weiter.Entwickeln</div>
    </div>
  </header>
</template>
