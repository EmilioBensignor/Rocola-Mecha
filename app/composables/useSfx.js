let ctx = null

function audioContext() {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noiseBuffer(c, seconds, fill) {
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = fill(i / data.length)
  return buffer
}

function envelope(c, peak, attack, release) {
  const gain = c.createGain()
  const t = c.currentTime
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(peak, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release)
  gain.connect(c.destination)
  return gain
}

export function useSfx() {
  function click({ peak, tone, length, body = 0 }) {
    const c = audioContext()
    const snap = c.createBufferSource()
    snap.buffer = noiseBuffer(c, length, t => (Math.random() * 2 - 1) * (1 - t) ** 3)
    const band = c.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = tone
    band.Q.value = 1.2
    snap.connect(band)
    band.connect(envelope(c, peak, 0.001, length))
    snap.start()
    if (!body) return

    const thump = c.createOscillator()
    thump.type = 'triangle'
    thump.frequency.setValueAtTime(tone / 18, c.currentTime)
    thump.frequency.exponentialRampToValueAtTime(tone / 40, c.currentTime + 0.08)
    thump.connect(envelope(c, peak * body, 0.002, 0.09))
    thump.start()
    thump.stop(c.currentTime + 0.12)
  }

  function press() {
    click({ tone: 600, peak: 1, length: 0.06, body: 0.9 })
  }

  function release() {
    click({ tone: 900, peak: 0.4, length: 0.04, body: 0.5 })
  }

  function lift() {
    click({ tone: 2600, peak: 0.3, length: 0.02 })
  }

  function needle() {
    const c = audioContext()
    const thump = c.createOscillator()
    thump.frequency.setValueAtTime(90, c.currentTime)
    thump.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.15)
    thump.connect(envelope(c, 0.5, 0.005, 0.2))
    thump.start()
    thump.stop(c.currentTime + 0.25)

    const hiss = c.createBufferSource()
    hiss.buffer = noiseBuffer(c, 1.4, () => (Math.random() < 0.003 ? Math.random() * 2 - 1 : (Math.random() * 2 - 1) * 0.04))
    const band = c.createBiquadFilter()
    band.type = 'highpass'
    band.frequency.value = 900
    hiss.connect(band)
    band.connect(envelope(c, 0.35, 0.01, 1.3))
    hiss.start()
  }

  function spinUp() {
    const c = audioContext()
    const motor = c.createOscillator()
    motor.type = 'sawtooth'
    motor.frequency.setValueAtTime(18, c.currentTime)
    motor.frequency.exponentialRampToValueAtTime(55, c.currentTime + 0.8)
    const low = c.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 260
    motor.connect(low)
    low.connect(envelope(c, 0.12, 0.3, 0.7))
    motor.start()
    motor.stop(c.currentTime + 1.1)
  }

  return { press, release, lift, needle, spinUp }
}
