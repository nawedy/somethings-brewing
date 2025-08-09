<!-- File: src/app/components/layout/Section.svelte -->
<!-- Purpose: Reusable section wrapper with consistent spacing, container, and themed backgrounds -->

<script>
  /** @type {'default' | 'muted' | 'contrast'} */
  export let variant = 'default';
  export let id = '';
  export let className = '';

  const base = 'w-full py-16';
  const bgMap = {
    default: 'bg-[#1E1B18]',
    muted: 'bg-[#231F1C]',
    contrast: 'bg-[#161311]'
  };
</script>

<section {id} class={`${base} ${bgMap[variant]} ${className}`}>
  <div class="mx-auto max-w-7xl px-6 md:px-10">
    <slot />
  </div>
  {#if variant !== 'contrast'}
    <div class="pointer-events-none select-none">
      <div class="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#3a2c22] to-transparent opacity-60"></div>
    </div>
  {/if}
</section>


