const ARTIST = 'Conociendo Rusia'

const TRACKS = [
  { title: 'Loco en el desierto', album: 'Conociendo Rusia', cover: 'conociendo-rusia', year: 2018, duration: 257, color: 'lima' },
  { title: 'Cicatriz', album: 'Conociendo Rusia', cover: 'conociendo-rusia', year: 2018, duration: 244, color: 'magenta' },
  { title: 'Cabildo y Juramento', album: 'Cabildo y Juramento', cover: 'cabildo-y-juramento', year: 2019, duration: 203, color: 'cyan' },
  { title: 'Quiero que me llames', album: 'Cabildo y Juramento', cover: 'cabildo-y-juramento', year: 2019, duration: 258, color: 'naranja' },
  { title: 'Puede ser', album: 'Cabildo y Juramento', cover: 'cabildo-y-juramento', year: 2019, duration: 230, color: 'violeta' },
  { title: 'Tu encanto', album: 'Tu encanto (feat. Fito Páez)', cover: 'tu-encanto', year: 2020, duration: 211, color: 'lima' },
  { title: 'La dirección', album: 'La dirección', cover: 'la-direccion', year: 2021, duration: 224, color: 'magenta' },
  { title: 'Mundo de cristal', album: 'La dirección', cover: 'la-direccion', year: 2021, duration: 251, color: 'cyan' },
  { title: 'Se me hizo tarde', album: 'La dirección', cover: 'la-direccion', year: 2021, duration: 237, color: 'naranja' },
  { title: 'Jet Love', album: 'Jet Love', cover: 'jet-love', year: 2024, duration: 235, color: 'violeta' },
  { title: 'Canciones', album: 'Jet Love', cover: 'jet-love', year: 2024, duration: 247, color: 'lima' },
  { title: 'Te lo voy a decir', album: 'Te lo voy a decir', cover: 'te-lo-voy-a-decir', year: 2024, duration: 246, color: 'magenta' },
]

const LETTERS = 'ABCDEF'

export const COLORS = {
  lima: '#ccff00',
  magenta: '#ff0099',
  cyan: '#22d3ee',
  naranja: '#ff6a00',
  violeta: '#7c3aed',
}

export function useJukeboxData() {
  const tracks = TRACKS.map((t, i) => ({
    ...t,
    artist: ARTIST,
    cover: `/covers/${t.cover}.jpg`,
    id: i,
    code: `${LETTERS[Math.floor(i / 2)]}${(i % 2) + 1}`,
    src: `/music/${LETTERS[Math.floor(i / 2)]}${(i % 2) + 1}.mp3`,
    hex: COLORS[t.color],
  }))
  return { tracks }
}

export function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
