import { targetElement, WIDTH, HEIGHT, SPACE, NEWLINE } from './grid.js'

const UPDATE_INTERVAL = 100

const BLOCK = "#"

// Rule 110: 01101110 in binary
// Pattern (left, center, right) -> new state
// 111 -> 0, 110 -> 1, 101 -> 1, 100 -> 0
// 011 -> 1, 010 -> 1, 001 -> 1, 000 -> 0
const RULE = {
  '111': SPACE,
  '110': BLOCK,
  '101': BLOCK,
  '100': SPACE,
  '011': BLOCK,
  '010': BLOCK,
  '001': BLOCK,
  '000': SPACE
}

const applyRule = (left, center, right) => {
  const pattern = `${left === BLOCK ? 1 : 0}${center === BLOCK ? 1 : 0}${right === BLOCK ? 1 : 0}`
  return RULE[pattern]
}

const nextRow = (row) => {
  const newRow = Array(WIDTH).fill(SPACE)
  for (let i = 0; i < WIDTH; i++) {
    const left = row[(i - 1 + WIDTH) % WIDTH]
    const center = row[i]
    const right = row[(i + 1) % WIDTH]
    newRow[i] = applyRule(left, center, right)
  }
  return newRow
}

// Initialize with a single cell on the right side (classic Rule 110 start)
let currentRow = Array(WIDTH).fill(SPACE)
currentRow[WIDTH - 2] = BLOCK

// Pre-fill the grid by running the automaton
let state = []
for (let i = 0; i < HEIGHT; i++) {
  state.push([...currentRow])
  currentRow = nextRow(currentRow)
}

let ruleInterval = setInterval(() => {
  targetElement.innerHTML = state.map(row => row.join('')).join(NEWLINE)

  // Shift rows up and add new row at bottom
  state.shift()
  currentRow = nextRow(currentRow)
  state.push([...currentRow])
}, UPDATE_INTERVAL)

window.addEventListener('pagehide', () => {
  clearInterval(ruleInterval)
})
