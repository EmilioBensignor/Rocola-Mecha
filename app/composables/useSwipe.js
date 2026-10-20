const SNAP_SPEED = 2.5
const WHEEL_SETTLE = 140

export function useSwipe(target, { axis = 'x', friction = 0.95, bounds = null, snap = null } = {}) {
  const pos = ref(0)
  const velocity = ref(0)
  const dragging = ref(false)

  let start = 0
  let from = 0
  let last = 0
  let lastT = 0
  let moved = false
  let frame = null
  let pointer = null
  let wheelTimer = null

  const read = e => (axis === 'x' ? e.clientX : e.clientY)
  const range = () => (typeof bounds === 'function' ? bounds() : bounds)

  function clamp(p, elastic) {
    const r = range()
    if (!r) return p
    const [min, max] = r
    if (p > max) return elastic ? max + (p - max) * 0.35 : max
    if (p < min) return elastic ? min + (p - min) * 0.35 : min
    return p
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame)
    frame = null
  }

  function onDown(e) {
    if (pointer !== null) return
    stop()
    pointer = e.pointerId
    start = last = read(e)
    from = pos.value
    lastT = e.timeStamp
    velocity.value = 0
    moved = false
    dragging.value = true
  }

  function onMove(e) {
    if (e.pointerId !== pointer) return
    const p = read(e)
    if (!moved && Math.abs(p - start) < 6) return
    if (!moved) target.value?.setPointerCapture?.(pointer)
    moved = true
    pos.value = clamp(from + (p - start), true)
    const dt = e.timeStamp - lastT
    if (dt <= 0) return
    velocity.value = velocity.value * 0.7 + ((p - last) / dt) * 0.3
    last = p
    lastT = e.timeStamp
  }

  function onUp(e) {
    if (e.pointerId !== pointer) return
    pointer = null
    dragging.value = false
    if (!moved) return
    const still = e.timeStamp - lastT > 100
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let v = still || reduce ? 0 : velocity.value * 16
    const glide = () => {
      v *= friction
      pos.value += v
      const r = range()
      let outside = false
      if (r) {
        const [min, max] = r
        if (pos.value > max) { pos.value += (max - pos.value) * 0.2; v *= 0.6; outside = pos.value > max + 0.5 }
        if (pos.value < min) { pos.value += (min - pos.value) * 0.2; v *= 0.6; outside = pos.value < min - 0.5 }
      }
      velocity.value = v / 16
      if (snap && Math.abs(v) < SNAP_SPEED && !outside) {
        velocity.value = 0
        goTo(snap(pos.value))
        return
      }
      if (Math.abs(v) > 0.15 || outside) {
        frame = requestAnimationFrame(glide)
        return
      }
      pos.value = clamp(pos.value, false)
      velocity.value = 0
      frame = null
    }
    frame = requestAnimationFrame(glide)
  }

  function goTo(dest) {
    stop()
    const goal = clamp(dest, false)
    const step = () => {
      pos.value += (goal - pos.value) * 0.18
      if (Math.abs(goal - pos.value) > 0.5) {
        frame = requestAnimationFrame(step)
        return
      }
      pos.value = goal
      frame = null
    }
    frame = requestAnimationFrame(step)
  }

  function onWheel(e) {
    e.preventDefault()
    stop()
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    pos.value = clamp(pos.value - delta, true)
    velocity.value = -delta / 16
    clearTimeout(wheelTimer)
    wheelTimer = setTimeout(() => {
      velocity.value = 0
      goTo(snap ? snap(pos.value) : pos.value)
    }, WHEEL_SETTLE)
  }

  const wasDrag = () => moved

  onMounted(() => {
    const el = target.value
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
  })

  onBeforeUnmount(() => {
    stop()
    clearTimeout(wheelTimer)
    const el = target.value
    if (!el) return
    el.removeEventListener('wheel', onWheel)
    el.removeEventListener('pointerdown', onDown)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointercancel', onUp)
  })

  return { pos, velocity, dragging, goTo, wasDrag }
}
