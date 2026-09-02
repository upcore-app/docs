<template>
  <!-- The lockup is the light artwork — white letters, blue/cyan pin — so it
       needs a dark ground of its own. The docs keep a colour-mode toggle: in
       light mode a page would swallow it whole, and in dark mode a near-black
       panel would sink into the page, so the surface lifts instead. -->
  <div class="outpost-mark my-6 flex items-center gap-5 rounded-xl border border-default px-5 py-4">
    <img
      src="/logo/Outpost_Logo_Duotone_Primary_Light_NB.svg"
      alt="Outpost"
      class="h-5 w-auto shrink-0"
    >
    <p class="text-sm text-white/60">
      <slot />
    </p>
  </div>
</template>

<style>
/* Not a Tailwind pair: `bg-[#0a0a0a]` and `dark:bg-elevated` carry the same
   specificity, so which one wins is down to utility order. Two plain rules
   settle it. */
.outpost-mark {
  background-color: #0a0a0a;
}

.dark .outpost-mark {
  background-color: var(--ui-bg-elevated);
}
</style>
