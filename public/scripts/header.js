const path = window.location.pathname;
const parts = path.split('/').filter(Boolean);

let breadcrumb = '<a href="/">home</a>';
let currentPath = '';
for (const part of parts) {
  currentPath += '/' + part;
  breadcrumb += ` / <a href="${currentPath}">${part}</a>`;
}

const header = document.createElement('div');
header.className = 'header';
header.innerHTML = `
  <span>${breadcrumb}</span>
  <nav>
    <a href="/blog">blog</a>
    <a href="/about">about</a>
  </nav>
`;

document.body.insertBefore(header, document.body.firstChild);
