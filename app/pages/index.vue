<template>
  <JukeboxCabinet
    :current="current"
    :status="jukebox.status(current)"
    @play="jukebox.play(current)"
  >
    <div
      ref="viewport"
      class="size-full relative"
    >
      <button
        v-for="(t, i) in jukebox.tracks"
        :key="t.id"
        type="button"
        :aria-label="t.title"
        class="size-160 absolute top-full left-1/2 rounded-full cursor-pointer"
        :style="discStyle(i)"
        @click="tap(i)"
      >
        <span
          class="size-full block relative rounded-full transition-shadow duration-300"
          :class="jukebox.playing.value?.id === t.id ? 'animate-spin-disc' : ''"
          :style="{
            background: 'repeating-radial-gradient(circle, #0d0d0d 0 2px, #1d1d1d 2px 4px)',
            boxShadow: i === index ? `0 0 0 4px ${t.hex}, 0 0 50px ${t.hex}, 0 30px 60px rgba(0,0,0,0.7)` : `0 0 0 2px ${t.hex}33, 0 30px 60px rgba(0,0,0,0.7)`,
          }"
        >
          <span
            class="size-full absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_40deg,rgba(255,255,255,0.07)_60deg,transparent_80deg_220deg,rgba(255,255,255,0.05)_240deg,transparent_260deg)]"
            :style="{ transform: `rotate(${pos * 0.6}deg)` }"
          />
          <span
            class="size-60 block absolute top-1/2 left-1/2 -translate-1/2 bg-cover bg-center rounded-full"
            :style="{ backgroundImage: `url(${t.cover})`, boxShadow: `0 0 0 6px ${t.hex}` }"
          >
            <span class="size-5 block absolute top-1/2 left-1/2 -translate-1/2 bg-negro rounded-full shadow-[0_0_0_3px_rgba(245,245,245,0.5)]" />
          </span>
        </span>
        <span
          v-if="badge(t)"
          class="absolute -top-2 left-1/2 -translate-x-1/2 bg-negro border-2 rounded-full font-display text-2xl tracking-widest whitespace-nowrap px-4 py-1"
          :style="{ borderColor: t.hex, color: t.hex }"
        >{{ badge(t) }}</span>
      </button>
    </div>
  </JukeboxCabinet>
</template>

<script setup>
const GAP = 360
const ARC_STEP = 42
const ARC_RADIUS = 700
const ARC_RISE = 200

const jukebox = useJukebox()

const viewport = ref(null)

const count = jukebox.tracks.length

const { pos, velocity, goTo, wasDrag } = useSwipe(viewport, {
  friction: 0.965,
  snap: p => Math.round(p / GAP) * GAP,
})

const index = computed(() => (((-Math.round(pos.value / GAP)) % count) + count) % count)
const current = computed(() => jukebox.tracks[index.value])

function offset(i) {
  const raw = i + pos.value / GAP
  return ((((raw + count / 2) % count) + count) % count) - count / 2
}

function discStyle(i) {
  const d = offset(i)
  const a = Math.min(Math.abs(d), 3)
  const angle = d * ARC_STEP
  const rad = angle * Math.PI / 180
  const tilt = Math.max(-14, Math.min(14, velocity.value * -5)) * (1 + a * 0.5)
  return {
    transform: `translate(calc(-50% + ${ARC_RADIUS * Math.sin(rad)}px), calc(-50% - ${ARC_RISE - ARC_RADIUS * (1 - Math.cos(rad))}px)) scale(${1 - a * 0.2}) rotate(${angle + tilt}deg)`,
    opacity: Math.abs(d) > 3.2 ? 0 : 1 - a * 0.25,
    zIndex: 10 - Math.round(a * 3),
  }
}

function badge(t) {
  if (jukebox.status(t) === 'playing') return 'Sonando'
  const spot = jukebox.queue.value.findIndex(q => q.id === t.id)
  return spot < 0 ? '' : `Fila ${spot + 1}`
}

function tap(i) {
  if (wasDrag()) return
  if (i !== index.value) goTo(pos.value - Math.round(offset(i)) * GAP)
}
</script>
