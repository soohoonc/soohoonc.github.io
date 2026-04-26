class InteractiveArt extends HTMLElement {
  async connectedCallback() {
    Object.assign(this.style, {
      display: 'block', width: '100%', overflow: 'hidden',
      fontFamily: 'monospace', fontSize: '10px', lineHeight: '1',
      whiteSpace: 'pre', userSelect: 'none', cursor: 'default',
      padding: '0', margin: '0 0 1em 0', boxSizing: 'border-box',
    });

    let charWidth = 6;
    try {
      const { prepareWithSegments, layoutWithLines } = await import('https://esm.sh/@chenglou/pretext');
      const { lines } = layoutWithLines(prepareWithSegments('M', '10px monospace'), Infinity, 10);
      charWidth = lines[0]?.width || 6;
    } catch (e) {}
    const charHeight = 10;
    const chars = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'.';

    let cols = 0, rows = 0, grid;

    const pointer = {
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
      active: false,
      strength: 0,
    };

    const updatePointer = (event) => {
      const rect = this.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      pointer.active = true;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    this._handlers = {
      updatePointer,
      clearPointer,
    };

    const resize = () => {
      const w = this.offsetWidth || 1024;
      const h = Math.min(450, w);
      this.style.height = `${h}px`;
      const newCols = Math.floor(w / charWidth);
      const newRows = Math.floor(h / charHeight);
      if (newCols === cols && newRows === rows) return;
      cols = newCols; rows = newRows;
      grid = new Array(cols * rows).fill('');
    };
    resize();

    this._ro = new ResizeObserver(resize);
    this._ro.observe(this);

    let time = Date.now() * 0.001;
    pointer.x = this.clientWidth / 2;
    pointer.y = this.clientHeight / 2;
    pointer.tx = pointer.x;
    pointer.ty = pointer.y;

    this.addEventListener('pointermove', this._handlers.updatePointer);
    this.addEventListener('pointerenter', this._handlers.updatePointer);
    this.addEventListener('pointerleave', this._handlers.clearPointer);

    const animate = () => {
      this._raf = requestAnimationFrame(animate);
      time += 0.005;
      pointer.strength = pointer.active
        ? Math.min(1, pointer.strength + 0.08)
        : Math.max(0, pointer.strength - 0.08);
      pointer.x += (pointer.tx - pointer.x) * 0.15;
      pointer.y += (pointer.ty - pointer.y) * 0.15;
      const px = (this.clientWidth || 1);
      const py = (this.clientHeight || 1);
      const cx = pointer.x / px;
      const cy = pointer.y / py;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / Math.max(1, cols);
          const ny = y / Math.max(1, rows);
          const dx = nx - cx;
          const dy = ny - cy;
          const influence = Math.max(0, 1 - Math.hypot(dx, dy) * 4) * pointer.strength;
          const warpX = nx + dx * influence * 0.08;
          const warpY = ny + dy * influence * 0.08;

          const n1 = Math.sin((warpX * cols) * 0.08 + time * 0.4 + influence * 0.4) * Math.cos((warpY * rows) * 0.08 + time * 0.3);
          const n2 = Math.sin((warpX * cols) * 0.15 - time * 0.5) * Math.cos((warpY * rows) * 0.12 + time * 0.4);
          const n3 = Math.sin((warpX * cols) * 0.04 + (warpY * rows) * 0.04 + time * 0.2);
          const n4 = Math.sin((warpX * cols) * 0.25 + time * 0.6) * Math.cos((warpY * rows) * 0.2 - time * 0.5);
          const n5 = Math.cos((warpX * cols) * 0.06 - (warpY * rows) * 0.07 + time * 0.25);
          const n6 = influence * Math.sin((nx * 20) + (ny * 20) + time * 3);
          const noise = (n1 + n2 * 0.6 + n3 * 0.4 + n4 * 0.3 + n5 * 0.5 + n6 * 0.15) / 2.95;
          grid[y * cols + x] = chars[Math.floor((noise + 1) * 0.5 * (chars.length - 1))];
        }
      }

      let out = '';
      for (let y = 0; y < rows; y++) {
        if (y > 0) out += '\n';
        for (let x = 0; x < cols; x++) out += grid[y * cols + x];
      }
      this.textContent = out;
    };

    animate();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    this.removeEventListener('pointermove', this._handlers?.updatePointer);
    this.removeEventListener('pointerenter', this._handlers?.updatePointer);
    this.removeEventListener('pointerleave', this._handlers?.clearPointer);
    this._handlers = null;
    this._ro?.disconnect();
  }
}

customElements.define('interactive-art', InteractiveArt);
