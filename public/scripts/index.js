const currentMinute = new Date().getMinutes();
const scriptName = (currentMinute % 2 === 0) ? 'life' : 'donut';

if (scriptName === 'life') {
  import('./life.js').catch(error => {
    console.error('Error loading life script:', error);
  });
} else {
  import('./donut.js').catch(error => {
    console.error('Error loading donut script:', error);
  });
}