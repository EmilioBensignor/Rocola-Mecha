const NEEDLE_DROP = 750
const SPIN_UP = 900

export function useJukebox() {
  const { tracks } = useJukeboxData()
  const sfx = useSfx()
  const playing = ref(null)
  const queue = ref([])
  const elapsed = ref(0)
  const paused = ref(false)
  const spinning = ref(false)

  let clock = null
  let audio = null
  let simulated = false
  let timers = []

  function status(track) {
    if (playing.value?.id === track?.id) return 'playing'
    return queue.value.some(t => t.id === track?.id) ? 'queued' : ''
  }

  function play(track) {
    if (paused.value && playing.value?.id === track?.id) {
      resume()
      return
    }
    if (paused.value) {
      queue.value = queue.value.filter(t => t.id !== track.id)
      playing.value = track
      return
    }
    if (status(track)) return
    if (playing.value) queue.value = [...queue.value, track]
    else playing.value = track
  }

  function pause() {
    if (!playing.value || paused.value) return
    clearTimers()
    paused.value = true
    spinning.value = false
    audio?.pause()
    sfx.lift()
  }

  function resume() {
    paused.value = false
    start()
  }

  function next() {
    const [first, ...rest] = queue.value
    playing.value = first ?? null
    queue.value = rest
    elapsed.value = 0
  }

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
  }

  function start() {
    clearTimers()
    timers.push(setTimeout(sfx.needle, NEEDLE_DROP))
    timers.push(setTimeout(() => {
      sfx.spinUp()
      spinning.value = true
    }, NEEDLE_DROP + 150))
    timers.push(setTimeout(() => {
      if (!simulated) audio.play().catch(() => {})
    }, NEEDLE_DROP + SPIN_UP))
  }

  watch(playing, track => {
    if (!audio) return
    simulated = false
    paused.value = false
    spinning.value = false
    audio.pause()
    if (!track) {
      clearTimers()
      audio.removeAttribute('src')
      return
    }
    audio.src = track.src
    audio.load()
    start()
  })

  onMounted(() => {
    audio = new Audio()
    audio.preload = 'auto'
    audio.addEventListener('loadedmetadata', () => {
      if (playing.value) playing.value.duration = Math.round(audio.duration)
    })
    audio.addEventListener('timeupdate', () => {
      elapsed.value = Math.floor(audio.currentTime)
    })
    audio.addEventListener('ended', next)
    audio.addEventListener('error', () => {
      if (playing.value) simulated = true
    })
    clock = setInterval(() => {
      if (!playing.value || !simulated || !spinning.value) return
      elapsed.value += 1
      if (elapsed.value >= playing.value.duration) next()
    }, 1000)
  })

  onBeforeUnmount(() => {
    clearInterval(clock)
    clearTimers()
    audio?.pause()
  })

  return { tracks, playing, queue, elapsed, paused, spinning, status, play, pause }
}
