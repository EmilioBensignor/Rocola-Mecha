# MechaRocola

App de la rocola de MECHA (estación E del bar, ver `../WebMecha/app/composables/useMechaData.js`): tablet 10–11″ horizontal en modo kiosko, touch. Elegir un tema cambia la música de todo el bar (QLab, integración pendiente). Investigación en `docs/investigacion.md`, plan y variantes en `docs/plan.md`.

## Convenciones

Las mismas que `../WebMecha` y `../WebAgenciaMecha`: cero comentarios en código, `<template>` → `<script setup>` → `<style scoped>`, sin `lang="ts"`, composables `.js`, UI en rioplatense, código en inglés. Tokens de color de marca en español (`negro`, `lima`, `magenta`), igual que los repos hermanos.

## Estructura

- `app/composables/useJukeboxData.js` — catálogo (12 temas de Conociendo Rusia como simulación, tapas en `public/covers/`, códigos A1–F2: cada letra es un simple con lado A y B).
- `app/composables/useJukebox.js` — `play(track)`: si no suena nada arranca, si no va a la fila FIFO; al terminar un tema arranca el siguiente. Un tema que suena o está en fila no se puede volver a pedir (`status`). `pause()` corta el audio, levanta la púa y el disco desacelera (giro por rAF en `index.vue`, no CSS). Moverse a otro disco pausa solo; play sobre el mismo reanuda, sobre otro lo cambia. Al arrancar: baja la púa, suena el aterrizaje, el disco acelera (`spinning`) y recién ahí el tema. Sin modales ni overlays: todo pasa en el mueble.
- `app/composables/useSfx.js` — clack mecánico de las teclas (`press` al hundir, `release` al soltar), púa y arranque de motor, todo sintetizado con Web Audio.
- `app/composables/useSwipe.js` — swipe libre con inercia (portado de la tira de `VisorFoto.vue` de nira-bokler a pointer events). Arrastre con inercia + rueda/trackpad. Opciones: `axis`, `friction`, `bounds`, `snap` (imán que actúa recién cuando la inercia baja de `SNAP_SPEED`, no al soltar). `wasDrag()` evita que el arrastre dispare el tap.
- `app/components/jukebox/` — `Cabinet`: el mueble (arco y columnas con tubos de luz, cúpula con los discos, abajo el tema centrado en blanco y una botonera analógica de 4 teclas: anterior, siguiente, play y pausa; play y pausa quedan hundidas mientras están activas).
- Audio: cada tema suena desde `public/music/{código}.mp3` (A1.mp3 … F2.mp3). La duración real sale del archivo; si falta, la fila avanza con el reloj simulado según `duration` del catálogo.
- `app/pages/index.vue` — la rocola: carrusel de discos en loop infinito dispuestos en arco dentro de la cúpula del mueble. Siempre termina con un disco centrado (imán). Las otras 9 variantes se descartaron.

## Comandos

- `pnpm dev` — expone en red (`--host`) para abrir desde la tablet.
- `pnpm generate` — estático para servir en kiosko.
