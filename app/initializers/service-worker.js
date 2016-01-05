export function initialize () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw-0.0.1.js')
      .catch(function (error) {
        console.error('Error registering service worker:' + error);
      });
  } else {
    console.warn('service worker not supported');
  }
}

export default {
  name: 'service-worker',
  initialize
};
