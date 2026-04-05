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

    const animate = () => {
      this._raf = requestAnimationFrame(animate);
      time += 0.005;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n1 = Math.sin(x * 0.08 + time * 0.4) * Math.cos(y * 0.08 + time * 0.3);
          const n2 = Math.sin(x * 0.15 - time * 0.5) * Math.cos(y * 0.12 + time * 0.4);
          const n3 = Math.sin(x * 0.04 + y * 0.04 + time * 0.2);
          const n4 = Math.sin(x * 0.25 + time * 0.6) * Math.cos(y * 0.2 - time * 0.5);
          const n5 = Math.cos(x * 0.06 - y * 0.07 + time * 0.25);
          const noise = (n1 + n2 * 0.6 + n3 * 0.4 + n4 * 0.3 + n5 * 0.5) / 2.8;
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
    this._ro?.disconnect();
  }
}

customElements.define('interactive-art', InteractiveArt);
