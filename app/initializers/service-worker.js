export function initialize () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister();
      }
      navigator.serviceWorker.register('./sw.js')
        .catch(error => {
          console.error(`Error registering service worker:${error}`);
        });
    });
  } else {
    console.warn('service worker not supported');
  }
}

export default {
  name: 'service-worker',
  initialize
};
