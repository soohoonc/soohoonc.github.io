class InteractiveArt extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.overflow = 'hidden';
    this.style.fontFamily = 'monospace';
    this.style.fontSize = '10px';
    this.style.lineHeight = '1';
    this.style.whiteSpace = 'pre';
    this.style.userSelect = 'none';
    this.style.cursor = 'default';
    this.style.padding = '0';
    this.style.margin = '0 0 1em 0';
    this.style.boxSizing = 'border-box';

    const width = this.offsetWidth || 1024;
    const height = Math.min(450, width);
    this.style.height = `${height}px`;
    const cols = Math.floor(width / 6);
    const rows = Math.floor(height / 10);

    const chars = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'.';
    let grid = [];
    let offsetX = [];
    let offsetY = [];

    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      offsetX[i] = [];
      offsetY[i] = [];
      for (let j = 0; j < cols; j++) {
        offsetX[i][j] = 0;
        offsetY[i][j] = 0;
      }
    }

    const render = () => {
      this.textContent = grid.map(row => row.join('')).join('\n');
    };

    let mouseX = cols / 2;
    let mouseY = rows / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let smoothVelX = 0;
    let smoothVelY = 0;

    this.addEventListener('mousemove', (e) => {
      const rect = this.getBoundingClientRect();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = (e.clientX - rect.left) / 6;
      mouseY = (e.clientY - rect.top) / 10;
    });

    this.addEventListener('mouseleave', () => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      smoothVelX = 0;
      smoothVelY = 0;
    });

    let time = Date.now() * 0.001;
    let affectedCells = new Set();
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      time += 0.005;

      const rawVelX = mouseX - prevMouseX;
      const rawVelY = mouseY - prevMouseY;
      const clampedVelX = Math.max(-5, Math.min(5, rawVelX));
      const clampedVelY = Math.max(-5, Math.min(5, rawVelY));
      smoothVelX = smoothVelX * 0.9 + clampedVelX * 0.1;
      smoothVelY = smoothVelY * 0.9 + clampedVelY * 0.1;
      const mouseSpeed = Math.sqrt(smoothVelX * smoothVelX + smoothVelY * smoothVelY);

      const mouseMoved = Math.abs(rawVelX) > 0.01 || Math.abs(rawVelY) > 0.01;

      const newAffectedCells = new Set();

      if (mouseMoved) {
        const minX = Math.max(0, Math.floor(mouseX - 20));
        const maxX = Math.min(cols, Math.ceil(mouseX + 20));
        const minY = Math.max(0, Math.floor(mouseY - 20));
        const maxY = Math.min(rows, Math.ceil(mouseY + 20));

        for (let y = minY; y < maxY; y++) {
          for (let x = minX; x < maxX; x++) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < 400) {
              const dist = Math.sqrt(distSq) + 1;
              const influence = Math.max(0, (20 - dist) / 20);

              offsetX[y][x] += smoothVelX * influence * influence * 0.3;
              offsetY[y][x] += smoothVelY * influence * influence * 0.3;

              offsetX[y][x] += -smoothVelY * influence * mouseSpeed * 0.1;
              offsetY[y][x] += smoothVelX * influence * mouseSpeed * 0.1;

              newAffectedCells.add(`${x},${y}`);
            }
          }
        }
      }

      const allAffected = new Set([...affectedCells, ...newAffectedCells]);
      for (const key of allAffected) {
        const [x, y] = key.split(',').map(Number);

        offsetX[y][x] = lerp(offsetX[y][x], 0, 0.05);
        offsetY[y][x] = lerp(offsetY[y][x], 0, 0.05);

        if (Math.abs(offsetX[y][x]) > 0.01 || Math.abs(offsetY[y][x]) > 0.01) {
          newAffectedCells.add(key);
        }
      }

      affectedCells = newAffectedCells;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const distortX = x + offsetX[y][x];
          const distortY = y + offsetY[y][x];

          const n1 = Math.sin(distortX * 0.08 + time * 0.4) * Math.cos(distortY * 0.08 + time * 0.3);
          const n2 = Math.sin(distortX * 0.15 - time * 0.5) * Math.cos(distortY * 0.12 + time * 0.4);
          const n3 = Math.sin(distortX * 0.04 + distortY * 0.04 + time * 0.2);
          const n4 = Math.sin(distortX * 0.25 + time * 0.6) * Math.cos(distortY * 0.2 - time * 0.5);
          const n5 = Math.cos(distortX * 0.06 - distortY * 0.07 + time * 0.25);

          const noise = (n1 + n2 * 0.6 + n3 * 0.4 + n4 * 0.3 + n5 * 0.5) / 2.8;

          const intensity = Math.floor((noise + 1) * 0.5 * (chars.length - 1));
          grid[y][x] = chars[Math.max(0, Math.min(chars.length - 1, intensity))];
        }
      }

      render();
      requestAnimationFrame(animate);
    };

    animate();
  }
}

customElements.define('interactive-art', InteractiveArt);
