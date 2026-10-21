const ARTIST = 'Conociendo Rusia'

const TRACKS = [
  { title: 'Loco en el desierto', album: 'Conociendo Rusia', cover: 'conociendo-rusia', year: 2018, duration: 257, color: 'lima' },
  { title: 'Cicatriz', album: 'Conociendo Rusia', cover: 'conociendo-rusia', year: 2018, duration: 244, color: 'magenta' },
  { title: 'Cabildo y Juramento', album: 'Cabildo y Juramento', cover: 'cabildo-y-juramento', year: 2019, duration: 203, color: 'cyan' },
  { title: 'Quiero que me llames', album: 'Cabildo y Juramento', cover: 'cabildo-y-juramento', year: 2019, duration: 258, color: 'lima' },
  { title: 'Puede ser', album: 'Cabildo y Juramento', cover: 'cabildo-y-juramento', year: 2019, duration: 230, color: 'magenta' },
  { title: 'Tu encanto', album: 'Tu encanto (feat. Fito Páez)', cover: 'tu-encanto', year: 2020, duration: 211, color: 'violeta' },
  { title: 'La dirección', album: 'La dirección', cover: 'la-direccion', year: 2021, duration: 224, color: 'lima' },
  { title: 'Mundo de cristal', album: 'La dirección', cover: 'la-direccion', year: 2021, duration: 251, color: 'magenta' },
  { title: 'Se me hizo tarde', album: 'La dirección', cover: 'la-direccion', year: 2021, duration: 237, color: 'cyan' },
  { title: 'Jet Love', album: 'Jet Love', cover: 'jet-love', year: 2024, duration: 235, color: 'lima' },
  { title: 'Canciones', album: 'Jet Love', cover: 'jet-love', year: 2024, duration: 247, color: 'magenta' },
  { title: 'Te lo voy a decir', album: 'Te lo voy a decir', cover: 'te-lo-voy-a-decir', year: 2024, duration: 246, color: 'violeta' },
]

const LETTERS = 'ABCDEF'

export const COLORS = {
  lima: '#ccff00',
  magenta: '#ff0099',
  cyan: '#22d3ee',
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
