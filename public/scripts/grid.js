const targetElement = document.getElementById('background')

const FONT_SIZE = Math.max(12, Math.min(window.innerWidth, window.innerHeight) * 0.01)
const CHAR_WIDTH = FONT_SIZE * 0.6
const CHAR_HEIGHT = FONT_SIZE
const WIDTH = Math.floor(window.innerWidth / CHAR_WIDTH)
const HEIGHT = Math.floor(window.innerHeight / CHAR_HEIGHT)

targetElement.style.setProperty('font-size', `${FONT_SIZE}px`, 'important')
targetElement.style.setProperty('line-height', `${FONT_SIZE}px`, 'important')

const SPACE = "&nbsp;"
const NEWLINE = "<br />"

export { targetElement, FONT_SIZE, CHAR_WIDTH, CHAR_HEIGHT, WIDTH, HEIGHT, SPACE, NEWLINE }
