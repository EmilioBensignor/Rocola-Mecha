<template>
  <div class="size-full flex gap-2 relative wood p-2 md:gap-3 md:p-3 xl:gap-4 xl:p-4">
    <div class="w-6 flex shrink-0 flex-col justify-center gap-1 relative rounded-full tube md:w-8 md:gap-1.5 xl:w-13 xl:gap-2">
      <span
        v-for="fin in 6"
        :key="fin"
        class="h-1 block -mx-1 rounded-full chrome shadow-[0_3px_6px_rgba(0,0,0,0.5)] md:h-1.5 xl:h-2 xl:-mx-1.5"
      />
    </div>

    <div class="flex flex-1 flex-col gap-2 min-w-0 md:gap-3">
      <div class="flex-1 relative min-h-0 arch tube p-1.5 xl:p-2.5">
        <div class="size-full arch chrome p-0.75">
          <div class="size-full relative arch bg-[radial-gradient(ellipse_at_50%_90%,#2a0a1e,#070707_70%)] overflow-hidden shadow-[inset_0_10px_40px_rgba(0,0,0,0.9)]">
            <slot />
            <span class="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.06)_42%,transparent_50%)]" />
          </div>
        </div>
      </div>

      <div class="flex shrink-0 flex-col gap-2 relative px-2 pb-1 md:flex-row md:items-center md:gap-6 md:px-4 2xl:gap-10 2xl:px-6">
        <div class="flex-1 min-w-0">
          <p
            :key="current.id"
            class="font-display text-4xl text-blanco leading-none truncate flicker md:text-6xl 2xl:text-8xl short:text-3xl"
          >
            {{ current.title }}
          </p>
          <p class="font-display text-sm text-blanco tracking-[0.25em] leading-tight truncate md:text-xl 2xl:text-2xl short:text-sm">
            {{ current.album }} · {{ current.year }}
          </p>
        </div>

        <div class="flex shrink-0 rounded-xl chrome shadow-[0_10px_24px_rgba(0,0,0,0.6)] p-1 2xl:p-1.5">
          <div class="flex flex-1 gap-1 bg-negro rounded-lg p-1 2xl:gap-1.5 2xl:p-1.5">
            <button
              v-for="key in KEYS"
              :key="key.id"
              type="button"
              :aria-label="key.label"
              :aria-pressed="latched(key.id)"
              class="w-12 h-11 flex flex-1 justify-center md:flex-none items-center rounded-md transition-[translate,box-shadow,background-color] duration-100 cursor-pointer analog md:w-16 md:h-14 2xl:w-24 2xl:h-20 short:h-10"
              :class="{ down: latched(key.id) }"
              @pointerdown="sfx.press()"
              @pointerup="sfx.release()"
              @click="emit(key.id)"
            >
              <Icon
                :name="key.icon"
                class="text-xl transition-colors duration-300 md:text-2xl 2xl:text-4xl"
                :style="{ color: latched(key.id) ? current.hex : '#bdbdbd' }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-6 flex shrink-0 flex-col justify-center gap-1 relative rounded-full tube md:w-8 md:gap-1.5 xl:w-13 xl:gap-2">
      <span
        v-for="fin in 6"
        :key="fin"
        class="h-1 block -mx-1 rounded-full chrome shadow-[0_3px_6px_rgba(0,0,0,0.5)] md:h-1.5 xl:h-2 xl:-mx-1.5"
      />
    </div>
  </div>
</template>

<script setup>
const KEYS = [
  { id: 'prev', icon: 'lucide:skip-back', label: 'Anterior' },
  { id: 'next', icon: 'lucide:skip-forward', label: 'Siguiente' },
  { id: 'play', icon: 'lucide:play', label: 'Ponelo' },
  { id: 'pause', icon: 'lucide:pause', label: 'Pausa' },
]

const props = defineProps({
  current: { type: Object, required: true },
  playing: { type: Boolean, default: false },
  paused: { type: Boolean, default: false },
})

const emit = defineEmits(['prev', 'next', 'play', 'pause'])

const sfx = useSfx()

function latched(id) {
  if (id === 'play') return props.playing && !props.paused
  if (id === 'pause') return props.paused
  return false
}
</script>

<style scoped>
.wood {
  background:
    repeating-linear-gradient(92deg, rgba(255, 255, 255, 0.025) 0 2px, transparent 2px 9px),
    linear-gradient(90deg, #070707, #141414 20%, #1e1e1e 50%, #141414 80%, #070707);
}

.chrome {
  background: linear-gradient(180deg, #f5f5f5, #8a8a8a 40%, #e2e2e2 55%, #5a5a5a);
}

.analog {
  background: linear-gradient(180deg, #4a4a4a, #262626 18%, #1a1a1a 80%, #0e0e0e);
  box-shadow: 0 6px 0 #000, inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.6);
}

.analog:active,
.analog.down {
  translate: 0 5px;
  background: linear-gradient(180deg, #2a2a2a, #161616 30%, #0e0e0e);
  box-shadow: 0 1px 0 #000, inset 0 3px 8px rgba(0, 0, 0, 0.9);
}

.arch {
  border-radius: 50% 50% 1.5rem 1.5rem / 42% 42% 1.5rem 1.5rem;
}

.tube {
  background: linear-gradient(180deg, #ff0099, #ff0099 10%, #7c3aed 22%, #22d3ee 34%, #ccff00 46%, #ccff00 56%, #22d3ee 68%, #7c3aed 80%, #ff0099 92%, #ff0099);
  background-size: 100% 300%;
  box-shadow: 0 0 40px rgba(255, 0, 153, 0.45), 0 0 90px rgba(204, 255, 0, 0.2), inset 6px 0 10px rgba(255, 255, 255, 0.45), inset -6px 0 12px rgba(0, 0, 0, 0.35);
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
