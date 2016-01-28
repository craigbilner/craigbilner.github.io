export function initialize() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw-cache.js')
      .then(() => {
        console.info('worker registered');
      })
      .catch(error => {
        console.error(`error registering service worker:${error}`);
      });
  } else {
    console.warn('service worker not supported');
  }

  //navigator.serviceWorker.getRegistrations().then(function (registrations) {
  //  registrations.forEach(function (registration) {
  //    registration.unregister()
  //  })
  //});
}

export default {
  name: 'service-worker',
  initialize
};
