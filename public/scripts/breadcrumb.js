class SiteBreadcrumb extends HTMLElement {
  connectedCallback() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    let breadcrumb = '<a href="/">home</a>';
    let currentPath = '';
    for (const part of parts) {
      currentPath += '/' + part;
      breadcrumb += ` / <a href="${currentPath}">${part}</a>`;
    }

    this.innerHTML = breadcrumb;
  }
}

customElements.define('site-breadcrumb', SiteBreadcrumb);
