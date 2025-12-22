const second = new Date().getSeconds();
const index = second % 3;

if (index === 0) {
  import('./life.js');
} else if (index === 1) {
  import('./donut.js');
} else {
  import('./rule110.js');
}