<script setup lang="ts">
const appConfig = useAppConfig()

const links = computed(() => appConfig.footer?.legal ?? [])
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
    <span>Copyright © {{ new Date().getFullYear() }}</span>

    <!-- The legal pages live on the product site, not in the docs content -
         they are the same imprint for every upcore surface. -->
    <ULink
      v-for="link of links"
      :key="link.to"
      :to="link.to"
      target="_blank"
      class="hover:text-default"
    >
      {{ link.label }}
    </ULink>
  </div>
</template>
