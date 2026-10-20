# Rocola MECHA: plan

## Contexto fijo

- Tablet 10–11″ horizontal, modo kiosko, touch. Diseño a 1280 × 800 (escala a 1194 × 834).
- Una sola tarea: elegir un tema y que suene en todo el bar.
- Catálogo corto (12 temas placeholder hasta tener la lista real).
- Identidad MECHA: negro `#070707`, lima `#ccff00`, magenta `#ff0099`, violeta, cyan, naranja de acento. Bebas Neue + Mozilla Text. Stickers 1–20, grano, halftone.

## Flujo (igual en las 10 variantes)

1. **Reposo / atracción:** luz en movimiento, "Tocá para elegir".
2. **Explorar:** swipe libre con inercia (el de la tira de VisorFoto de nira-bokler, portado a pointer events).
3. **Elegir:** tap en un tema → se destaca con su código (A1…).
4. **Confirmar:** "Va a sonar en todo el bar" → botón grande.
5. **Cae el disco:** 1,5 s de animación mecánica.
6. **Sonando:** tema, barra de progreso, vuelve a reposo solo a los 20 s sin toque.

## Variantes (quedan 5)

| Nombre | Metáfora | Gesto |
|---|---|---|
| Carrusel | Discos de 45 parados en el mecanismo, giran y se inclinan con la velocidad | Swipe libre + slide con trackpad, imán suave al disco más cercano |
| Neón | Cada tema es un cartel que se prende al llegar al centro | Igual, con skew por velocidad |
| Tapas | Fundas de simples sueltas | Swipe libre sin imán, como la tira de Nira |
| Dial | Selector circular | Giro infinito, imán al paso |
| Display 80s | Gabinete Rowe AMI R-80/R-81 (1976–77) | Vertical con imán a la fila |

Descartadas: Tiras, Bubbler, Botonera, Wallbox, Marquesina.

**Elegida: Carrusel + neón**, en loop infinito, siempre centrada, con fila de temas como una rocola real. Vive en `app/pages/index.vue`; el resto se borró.

## Pasos

1. Investigación → `docs/investigacion.md`. **Listo.**
2. Proyecto base: Nuxt 4 + Tailwind v4, tokens de MECHA, `useJukeboxData.js`, `useJukebox.js`, `useSwipe.js`, flujo compartido, índice `/` con las 10. **Listo.**
3. Variante 1 completa para validar el swipe y el flujo en la tablet. **Listo.**
4. Variantes 2–10. **Listo.** Recorte a 5 y gesto más libre. **Listo.**
5. Elegir 1–2, pulir y conectar a QLab (MQTT/OSC por red, a definir con el equipo técnico).
