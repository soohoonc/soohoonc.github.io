import { targetElement, WIDTH, HEIGHT, SPACE, NEWLINE } from './grid.js'

const UPDATE_INTERVAL = 100

const BLOCK = "#"
const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
];

const gliderGenerator = (startX, startY, state, rotation = 0) => {
  const patternWidth = 37
  const patternHeight = 10

  const transform = (x, y) => {
    switch (rotation) {
      case 90: return [patternHeight - y, x]
      case 180: return [patternWidth - x, patternHeight - y]
      case 270: return [y, patternWidth - x]
      default: return [x, y]
    }
  }
  const coords = [
    [1, 5], [2, 5], [1, 6], [2, 6],
    [13, 3], [14, 3], [12, 4], [11, 5], [11, 6], [11, 7], [12, 8], [13, 9], [14, 9],
    [15, 6],
    [16, 4], [17, 5], [17, 6], [18, 6], [17, 7], [16, 8],
    [21, 3], [22, 3], [21, 4], [22, 4], [21, 5], [22, 5],
    [23, 2], [23, 6], [25, 1], [25, 2], [25, 6], [25, 7],
    [35, 3], [36, 3], [35, 4], [36, 4]
  ]

  coords.forEach(([x, y]) => {
    const [newX, newY] = transform(x, y)
    const finalX = startX + newX
    const finalY = startY + newY

    if (finalY >= 0 && finalY < HEIGHT && finalX >= 0 && finalX < WIDTH) {
      state[finalY][finalX] = BLOCK
    }
  })

  return state
}

let state = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(SPACE))
gliderGenerator(2, 0, state, 0)
gliderGenerator(WIDTH - 39, HEIGHT - 12, state, 180)
gliderGenerator(2, HEIGHT - 39, state, 270)
gliderGenerator(WIDTH - 12, 2, state, 90)

let lifeInterval = setInterval(() => {
  targetElement.innerHTML = state.map(row => row.join('')).join(NEWLINE)
  let new_state = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(SPACE))
  for (let i = 1; i < HEIGHT - 1; i += 1) {
    for (let j = 1; j < WIDTH - 1; j += 1) {
      let alive = state[i][j] === BLOCK
      let count = DIRECTIONS.reduce((acc, [di, dj]) => {
        return acc + (state[i + di][j + dj] === BLOCK ? 1 : 0)
      }, 0)
      new_state[i][j] = ((alive && (count === 2 || count === 3)) || (!alive && count === 3)) ? BLOCK : SPACE
    }
  }
  state = new_state
}, UPDATE_INTERVAL)

const handleInteraction = (e) => {
  const touch = e.touches ? e.touches[0] : e
  const x = touch.clientX
  const y = touch.clientY

  const col = Math.floor((x / window.innerWidth) * WIDTH)
  const row = Math.floor((y / window.innerHeight) * HEIGHT)

  if (row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH) {
    state[row][col] = BLOCK
  }
}

document.addEventListener('mousemove', handleInteraction)
document.addEventListener('touchmove', handleInteraction)
document.addEventListener('touchstart', handleInteraction)

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(lifeInterval)
  } else {
    lifeInterval = setInterval(() => {
      targetElement.innerHTML = state.map(row => row.join('')).join(NEWLINE)
      let new_state = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(SPACE))
      for (let i = 1; i < HEIGHT - 1; i += 1) {
        for (let j = 1; j < WIDTH - 1; j += 1) {
          let alive = state[i][j] === BLOCK
          let count = DIRECTIONS.reduce((acc, [di, dj]) => {
            return acc + (state[i + di][j + dj] === BLOCK ? 1 : 0)
          }, 0)
          new_state[i][j] = ((alive && (count === 2 || count === 3)) || (!alive && count === 3)) ? BLOCK : SPACE
        }
      }
      state = new_state
    }, UPDATE_INTERVAL)
  }
})
