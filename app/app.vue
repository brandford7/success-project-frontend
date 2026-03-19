<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <Toaster position="top-right" richColors closeButton />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">

import { Toaster } from "@hoppscotch/vue-sonner";
</script>