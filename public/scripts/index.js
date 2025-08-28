const second = new Date().getSeconds();
const scriptName = (() => {
  switch (second % 3) {
    // case 0:
    //   return 'life';
    // case 1:
    //   return 'donut';
    default:
      return 'skull';
  }
})();

if (scriptName === 'life') {
  import('./life.js').catch(error => {
    console.error('Error loading life script:', error);
  });
} else if (scriptName === 'skull') {
  import('./skull.js').catch(error => {
    console.error('Error loading skull script:', error);
  });
} else {
  import('./donut.js').catch(error => {
    console.error('Error loading donut script:', error);
  });
}