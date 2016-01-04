export function initialize () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        console.info('unregistering', registration);
        registration.unregister();
      }
      console.info('registering', './sw.js');
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
