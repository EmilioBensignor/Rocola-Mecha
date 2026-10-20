<template>
  <div class="size-full flex gap-4 relative wood p-4">
    <div class="w-9 flex shrink-0 flex-col justify-center gap-2 relative rounded-full tube">
      <span
        v-for="fin in 6"
        :key="fin"
        class="h-2 block -mx-1.5 rounded-full chrome shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
      />
    </div>

    <div class="flex flex-1 flex-col gap-3 min-w-0">
      <div class="flex-1 relative min-h-0 arch tube p-2.5">
        <div class="size-full arch chrome p-0.75">
          <div class="size-full relative arch bg-[radial-gradient(ellipse_at_50%_90%,#2a0a1e,#070707_70%)] overflow-hidden shadow-[inset_0_10px_40px_rgba(0,0,0,0.9)]">
            <slot />
            <span class="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.06)_42%,transparent_50%)]" />
          </div>
        </div>
      </div>

      <div class="h-28 flex shrink-0 items-center relative px-8">
        <div class="h-20 flex-1 min-w-0 rounded-full chrome p-0.75">
          <div
            class="size-full flex flex-col justify-center rounded-full backlit transition-[background-color,box-shadow] duration-500 pl-14 pr-36"
            :style="{ backgroundColor: current.hex, boxShadow: `0 0 40px ${current.hex}66` }"
          >
            <p
              :key="current.id"
              class="w-full font-display text-4xl text-negro leading-none truncate flicker"
            >
              {{ current.title }}
            </p>
            <p class="font-display text-lg text-negro/60 tracking-[0.25em] leading-tight truncate">
              {{ current.album }} · {{ current.year }}
            </p>
          </div>
        </div>

        <button
          type="button"
          :aria-label="label"
          :disabled="Boolean(status)"
          class="size-28 absolute top-1/2 right-4 -translate-y-1/2 rounded-full chrome shadow-[0_10px_24px_rgba(0,0,0,0.6)] cursor-pointer group p-2"
          @click="emit('play')"
        >
          <span
            class="size-full flex justify-center items-center rounded-full bg-[radial-gradient(circle_at_40%_30%,#3a3a3a,#070707_70%)] shadow-[0_6px_0_#000] transition-[transform,box-shadow] duration-100 group-enabled:group-active:translate-y-1.5 group-enabled:group-active:shadow-[0_0_0_#000]"
          >
            <Icon
              :name="icon"
              class="size-12 transition-colors duration-300"
              :style="{ color: current.hex, filter: status ? 'none' : `drop-shadow(0 0 10px ${current.hex})`, opacity: status ? 0.5 : 1 }"
            />
          </span>
        </button>
      </div>
    </div>

    <div class="w-9 flex shrink-0 flex-col justify-center gap-2 relative rounded-full tube">
      <span
        v-for="fin in 6"
        :key="fin"
        class="h-2 block -mx-1.5 rounded-full chrome shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  current: { type: Object, required: true },
  status: { type: String, default: '' },
})

const emit = defineEmits(['play'])

const icon = computed(() => ({ playing: 'lucide:audio-lines', queued: 'lucide:list-music' })[props.status] ?? 'lucide:play')
const label = computed(() => ({ playing: 'Ya está sonando', queued: 'Ya está en la fila' })[props.status] ?? 'Ponelo')
</script>

<style scoped>
.wood {
  background:
    repeating-linear-gradient(92deg, rgba(0, 0, 0, 0.12) 0 2px, transparent 2px 9px),
    linear-gradient(90deg, #2a140a, #5a2f16 20%, #6e3a1c 50%, #5a2f16 80%, #2a140a);
}

.chrome {
  background: linear-gradient(180deg, #f5f5f5, #8a8a8a 40%, #e2e2e2 55%, #5a5a5a);
}

.backlit {
  background-image: radial-gradient(ellipse at 45% 35%, rgba(255, 255, 255, 0.55), transparent 65%), linear-gradient(180deg, rgba(255, 255, 255, 0.25), transparent 45%, rgba(0, 0, 0, 0.2));
}

.arch {
  border-radius: 50% 50% 1.5rem 1.5rem / 42% 42% 1.5rem 1.5rem;
}

.tube {
  background: linear-gradient(180deg, #7c3aed, #ff0099, #ff6a00, #ccff00, #ff6a00, #ff0099, #7c3aed);
  background-size: 100% 300%;
  box-shadow: 0 0 40px rgba(255, 0, 153, 0.45), 0 0 90px rgba(255, 106, 0, 0.25), inset 6px 0 10px rgba(255, 255, 255, 0.45), inset -6px 0 12px rgba(0, 0, 0, 0.35);
  animation: cycle 36s linear infinite;
}

@keyframes cycle {
  to { background-position: 0 300%; }
}

@keyframes flicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.4; }
}

.flicker {
  animation: flicker 0.6s linear 1;
}

@media (prefers-reduced-motion: reduce) {
  .tube,
  .flicker {
    animation: none;
  }
}
</style>
