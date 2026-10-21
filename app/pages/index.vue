<template>
  <JukeboxCabinet
    :current="current"
    :playing="Boolean(jukebox.playing.value)"
    :paused="jukebox.paused.value"
    @prev="step(1)"
    @next="step(-1)"
    @play="jukebox.play(current)"
    @pause="jukebox.pause()"
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
        class="size-160 absolute top-full left-1/2 rounded-full will-change-transform cursor-pointer"
        :style="discStyle(i)"
        @click="tap(i)"
      >
        <span
          class="size-full block relative rounded-full transition-shadow duration-300"
          
          :style="{
            background: 'repeating-radial-gradient(circle, #0d0d0d 0 2px, #1d1d1d 2px 4px)',
            transform: jukebox.playing.value?.id === t.id ? `rotate(${spin}deg)` : 'none',
            boxShadow: i === index ? `0 0 0 4px ${t.hex}, 0 0 50px ${t.hex}, 0 30px 60px rgba(0,0,0,0.7)` : `0 0 0 3px rgba(245,245,245,0.6), 0 30px 60px rgba(0,0,0,0.7)`,
          }"
        >
          <span
            class="size-full absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_40deg,rgba(255,255,255,0.07)_60deg,transparent_80deg_220deg,rgba(255,255,255,0.05)_240deg,transparent_260deg)]"
            :style="{ transform: `rotate(${pos * 0.6}deg)` }"
          />
          <span
            class="size-84 block absolute top-1/2 left-1/2 -translate-1/2 bg-cover bg-center rounded-full"
            :style="{ backgroundImage: `url(${t.cover})`, boxShadow: `0 0 0 6px ${i === index ? t.hex : '#f5f5f5'}`, transition: 'box-shadow 300ms' }"
          >
            <span class="size-5 block absolute top-1/2 left-1/2 -translate-1/2 bg-negro rounded-full shadow-[0_0_0_3px_rgba(245,245,245,0.5)]" />
          </span>
        </span>
        <span
          v-if="badge(t)"
          class="absolute -top-2 left-1/2 -translate-x-1/2 bg-negro border-2 rounded-full font-display tracking-widest whitespace-nowrap px-4 py-1"
          :style="{ borderColor: i === index ? t.hex : '#f5f5f5', color: i === index ? t.hex : '#f5f5f5', fontSize: `${Math.max(24, 16 / k)}px` }"
        >{{ badge(t) }}</span>
      </button>
      <div
        class="size-0 absolute top-full left-1/2 z-20 pointer-events-none"
        :style="{ transform: `translateY(${-ARC_RISE * k}px) scale(${k})` }"
      >
        <div
          class="absolute"
          :style="{ left: `${ARM_PIVOT.x}px`, top: `${ARM_PIVOT.y}px` }"
        >
          <span class="size-28 block absolute top-0 left-0 -translate-1/2 bg-[conic-gradient(from_20deg,#9a9a9a,#e8e8e8,#7a7a7a,#d0d0d0,#6e6e6e,#e8e8e8,#9a9a9a)] rounded-full shadow-[0_16px_30px_rgba(0,0,0,0.75),inset_0_0_0_2px_rgba(0,0,0,0.25)]">
            <span class="size-16 block absolute top-1/2 left-1/2 -translate-1/2 bg-[#3a3a3a] rounded-full shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)]" />
          </span>
          <span
            class="w-0 block absolute top-0 left-0 origin-top transition-[transform,filter] duration-700 ease-in-out"
            :style="{
              height: `${ARM_LENGTH}px`,
              transform: `rotate(${armDown ? ARM_ANGLE : 0}deg) scale(${armDown ? 1 : 1.03})`,
              filter: `drop-shadow(0 ${armDown ? 8 : 22}px ${armDown ? 6 : 14}px rgba(0,0,0,0.65))`,
            }"
          >
            <span class="w-2.5 h-8 block absolute bottom-full left-0 -translate-x-1/2 bg-[linear-gradient(90deg,#b5b5b5,#ffffff_45%,#9a9a9a)]" />
            <span class="w-14 h-12 block absolute bottom-full left-0 -translate-x-1/2 bg-[repeating-linear-gradient(0deg,#cfcfcf_0_3px,#f5f5f5_3px_5px),linear-gradient(90deg,#9a9a9a,#ffffff_45%,#a8a8a8)] bg-blend-overlay rounded-md mb-7" />
            <span
              class="w-3 block absolute top-0 left-0 -translate-x-1/2 bg-[linear-gradient(90deg,#b5b5b5,#ffffff_40%,#e0e0e0_70%,#9a9a9a)] rounded-full"
              :style="{ height: `${ARM_LENGTH - 44}px` }"
            />
            <span class="w-9 h-14 block absolute bottom-0 left-0 -translate-x-1/2 bg-[linear-gradient(90deg,#c8c8c8,#ffffff_45%,#d4d4d4)] rounded-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]">
              <span class="w-6 h-1.5 block absolute top-3 right-full bg-[linear-gradient(180deg,#e8e8e8,#7a7a7a)] rounded-l-full" />
              <span class="w-5 h-6 block absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#050505] rounded-[3px] shadow-[0_0_0_1px_#3a3a3a]" />
              <span class="w-1 h-2 block absolute top-full left-1/2 -translate-x-1/2 bg-[#cfcfcf] rounded-b-full" />
            </span>
          </span>
          <span class="size-9 block absolute top-0 left-0 -translate-1/2 bg-[radial-gradient(circle_at_35%_30%,#f5f5f5,#9a9a9a_50%,#3a3a3a)] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.6)]" />
        </div>
      </div>
    </div>
  </JukeboxCabinet>
</template>

<script setup>
const GAP = 360
const ARC_STEP = 42
const SPIN_SPEED = 360 / 2.8
const ARC_RADIUS = 700
const ARC_RISE = 200
const ARC_SPREAD = 1.06
const FIT_WIDTH = 710
const FIT_HEIGHT = 585
const ARM_PIVOT = { x: 420, y: -215 }
const ARM_LENGTH = 210
const ARM_ANGLE = 70
const CENTER_LIFT = 15

const jukebox = useJukebox()

const viewport = ref(null)
const k = ref(1)
const spin = ref(0)

const count = jukebox.tracks.length

const { pos, velocity, dragging, goTo, wasDrag } = useSwipe(viewport, {
  friction: 0.965,
  snap: p => Math.round(p / gap()) * gap(),
})

const gap = () => GAP * k.value

const index = computed(() => (((-Math.round(pos.value / gap())) % count) + count) % count)
const current = computed(() => jukebox.tracks[index.value])
const armDown = computed(() => !dragging.value && !jukebox.paused.value && jukebox.status(current.value) === 'playing')

function offset(i) {
  const raw = i + pos.value / gap()
  return ((((raw + count / 2) % count) + count) % count) - count / 2
}

function discStyle(i) {
  const d = offset(i)
  const a = Math.min(Math.abs(d), 3)
  const angle = d * ARC_STEP
  const rad = angle * Math.PI / 180
  const tilt = Math.max(-14, Math.min(14, velocity.value * -5)) * (1 + a * 0.5)
  return {
    transform: `translate(calc(-50% + ${ARC_RADIUS * ARC_SPREAD * Math.sin(rad) * k.value}px), calc(-50% - ${(ARC_RISE + Math.max(0, 1 - a) * CENTER_LIFT - ARC_RADIUS * (1 - Math.cos(rad))) * k.value}px)) scale(${(1 - a * 0.05 + Math.max(0, 1 - a) * 0.05) * k.value}) rotate(${angle + tilt}deg)`,
    opacity: Math.abs(d) > 3.2 ? 0 : 1 - a * 0.03,
    zIndex: 10 - Math.round(a * 3),
  }
}

function badge(t) {
  const spot = jukebox.queue.value.findIndex(q => q.id === t.id)
  return spot < 0 ? '' : `Fila ${spot + 1}`
}

function step(dir) {
  goTo(Math.round(pos.value / gap() + dir) * gap())
}

function tap(i) {
  if (wasDrag()) return
  if (i !== index.value) goTo(pos.value - Math.round(offset(i)) * gap())
}

watch(index, () => {
  const track = jukebox.playing.value
  if (track && !jukebox.paused.value && track.id !== current.value.id) jukebox.pause()
})

watch(() => jukebox.playing.value?.id, () => {
  spin.value = 0
  spinSpeed = 0
})

function turn(time) {
  const dt = spinLast ? (time - spinLast) / 1000 : 0
  spinLast = time
  const target = jukebox.spinning.value ? SPIN_SPEED : 0
  spinSpeed += (target - spinSpeed) * (target ? 0.04 : 0.025)
  if (spinSpeed < 0.5 && !target) spinSpeed = 0
  spin.value = (spin.value + spinSpeed * dt) % 360
  spinFrame = requestAnimationFrame(turn)
}

watch(k, (next, prev) => {
  pos.value *= next / prev
})

let observer = null
let spinFrame = null
let spinLast = 0
let spinSpeed = 0

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect
    if (width && height) k.value = Math.min(width / FIT_WIDTH, height / FIT_HEIGHT)
  })
  observer.observe(viewport.value)
  spinFrame = requestAnimationFrame(turn)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(spinFrame)
})
</script>
