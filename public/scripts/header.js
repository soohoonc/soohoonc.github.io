class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.className = 'header';
    this.innerHTML = `
      <site-breadcrumb></site-breadcrumb>
      <nav>
        <a href="/blog">blog</a>
        <a href="/about">about</a>
      </nav>
    `;
  }
}

customElements.define('site-header', SiteHeader);
