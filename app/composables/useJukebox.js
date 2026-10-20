export function useJukebox() {
  const { tracks } = useJukeboxData()
  const playing = ref(null)
  const queue = ref([])
  const elapsed = ref(0)

  let clock = null
  let audio = null
  let simulated = false

  function status(track) {
    if (playing.value?.id === track?.id) return 'playing'
    return queue.value.some(t => t.id === track?.id) ? 'queued' : ''
  }

  function play(track) {
    if (status(track)) return
    if (playing.value) queue.value = [...queue.value, track]
    else playing.value = track
  }

  function next() {
    const [first, ...rest] = queue.value
    playing.value = first ?? null
    queue.value = rest
    elapsed.value = 0
  }

  watch(playing, track => {
    if (!audio) return
    simulated = false
    if (!track) {
      audio.pause()
      audio.removeAttribute('src')
      return
    }
    audio.src = track.src
    audio.play().catch(() => {})
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
      if (!playing.value || !simulated) return
      elapsed.value += 1
      if (elapsed.value >= playing.value.duration) next()
    }, 1000)
  })

  onBeforeUnmount(() => {
    clearInterval(clock)
    audio?.pause()
  })

  return { tracks, playing, queue, elapsed, status, play }
}
