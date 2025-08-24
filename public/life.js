const targetElement = document.getElementById('life')

const UPDATE_INTERVAL = 300
const PADDING = 5
const DISPLAY_WIDTH = 48
const DISPLAY_HEIGHT = 16
const WIDTH = DISPLAY_WIDTH + 2 * PADDING
const HEIGHT = DISPLAY_HEIGHT + 2 * PADDING

const BLOCK = "#"
const SPACE = "."
const NEWLINE = "<br />"
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
let state = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(SPACE))
// glider generator
state[PADDING + 5][PADDING + 1] = BLOCK
state[PADDING + 5][PADDING + 2] = BLOCK
state[PADDING + 6][PADDING + 1] = BLOCK
state[PADDING + 6][PADDING + 2] = BLOCK

state[PADDING + 3][PADDING + 13] = BLOCK
state[PADDING + 3][PADDING + 14] = BLOCK
state[PADDING + 4][PADDING + 12] = BLOCK
state[PADDING + 5][PADDING + 11] = BLOCK
state[PADDING + 6][PADDING + 11] = BLOCK
state[PADDING + 7][PADDING + 11] = BLOCK
state[PADDING + 8][PADDING + 12] = BLOCK
state[PADDING + 9][PADDING + 13] = BLOCK
state[PADDING + 9][PADDING + 14] = BLOCK

state[PADDING + 6][PADDING + 15] = BLOCK

state[PADDING + 4][PADDING + 16] = BLOCK
state[PADDING + 5][PADDING + 17] = BLOCK
state[PADDING + 6][PADDING + 17] = BLOCK
state[PADDING + 6][PADDING + 18] = BLOCK
state[PADDING + 7][PADDING + 17] = BLOCK
state[PADDING + 8][PADDING + 16] = BLOCK

state[PADDING + 3][PADDING + 21] = BLOCK
state[PADDING + 3][PADDING + 22] = BLOCK
state[PADDING + 4][PADDING + 21] = BLOCK
state[PADDING + 4][PADDING + 22] = BLOCK
state[PADDING + 5][PADDING + 21] = BLOCK
state[PADDING + 5][PADDING + 22] = BLOCK

state[PADDING + 2][PADDING + 23] = BLOCK
state[PADDING + 6][PADDING + 23] = BLOCK
state[PADDING + 1][PADDING + 25] = BLOCK
state[PADDING + 2][PADDING + 25] = BLOCK
state[PADDING + 6][PADDING + 25] = BLOCK
state[PADDING + 7][PADDING + 25] = BLOCK

state[PADDING + 3][PADDING + 35] = BLOCK
state[PADDING + 3][PADDING + 36] = BLOCK
state[PADDING + 4][PADDING + 35] = BLOCK
state[PADDING + 4][PADDING + 6] = BLOCK

let lifeInterval = setInterval(() => {
  const displayState = state.slice(PADDING, PADDING + DISPLAY_HEIGHT).map(row =>
    row.slice(PADDING, PADDING + DISPLAY_WIDTH)
  )
  targetElement.innerHTML = NEWLINE + displayState.map(row => row.join('')).join(NEWLINE)
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
  const rect = targetElement.getBoundingClientRect()
  const touch = e.touches ? e.touches[0] : e
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  const charWidth = rect.width / DISPLAY_WIDTH
  const charHeight = rect.height / DISPLAY_HEIGHT

  const col = Math.floor(x / charWidth)
  const row = Math.floor(y / charHeight)

  if (row >= 0 && row < DISPLAY_HEIGHT && col >= 0 && col < DISPLAY_WIDTH) {
    state[row + PADDING][col + PADDING] = BLOCK
  }
}

targetElement.addEventListener('mousemove', handleInteraction)
targetElement.addEventListener('touchmove', handleInteraction)
targetElement.addEventListener('touchstart', handleInteraction)

window.addEventListener('pagehide', () => {
  clearInterval(lifeInterval)
})