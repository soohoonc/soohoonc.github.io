import { targetElement, WIDTH, HEIGHT, SPACE, NEWLINE } from './grid.js'

const UPDATE_INTERVAL = 42

const SHADES = '.,-~:;=!*#$@'

const PADDING = 5
const INNER_RADIUS = 2.4
const R1_POINTS = 90
const R2_POINTS = 314
const FOV = 5
const SCALE = Math.min(WIDTH, HEIGHT) - 2 * PADDING

let A = 0
let B = 0

let state = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(SPACE))

let donutInterval = setInterval(() => {
  state = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(SPACE))
  const zBuffer = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0))

  const centerX = Math.floor(WIDTH / 2)
  const centerY = Math.floor(HEIGHT / 2)

  for (let j = 0; j < 6.28; j += 6.28 / R1_POINTS) {
    for (let i = 0; i < 6.28; i += 6.28 / R2_POINTS) {
      const c = Math.sin(i)
      const d = Math.cos(j)
      const e = Math.sin(A)
      const f = Math.sin(j)
      const g = Math.cos(A)

      const h = d + INNER_RADIUS
      const D = 1 / (c * h * e + f * g + FOV)

      const l = Math.cos(i)
      const m = Math.cos(B)
      const n = Math.sin(B)
      const t = c * h * g - f * e

      const x = Math.floor(centerX + SCALE * D * (l * h * m - t * n))
      const y = Math.floor(centerY + (SCALE / 2) * D * (l * h * n + t * m))

      if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && D > zBuffer[y][x]) {
        zBuffer[y][x] = D

        const shadeIndex = Math.floor(
          (SHADES.length - 1) * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n) / 2 + SHADES.length / 2
        )
        const clampedIndex = Math.max(0, Math.min(SHADES.length - 1, shadeIndex))
        state[y][x] = SHADES[clampedIndex]
      }
    }
  }

  targetElement.innerHTML = state.map(row => row.join('')).join(NEWLINE)

  A += 0.04
  B += 0.02
}, UPDATE_INTERVAL)

window.addEventListener('pagehide', () => {
  clearInterval(donutInterval)
})
