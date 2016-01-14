export function initialize() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      const activeWorkers = [];
      for (let registration of registrations) {
        activeWorkers.push(registration.active && registration.active.scriptURL);
      }
      const hasWorker = activeWorkers.some(worker => ~worker.indexOf('sw-cache.js'));
      if (!hasWorker) {
        console.info('worker does not exist');
        navigator.serviceWorker.register('/sw-cache.js')
          .then(() => {
            console.info('worker registered');
          })
          .catch(error => {
            console.error(`error registering service worker:${error}`);
          });
      } else {
        console.info('worker already registered');
      }
    });
  } else {
    console.warn('service worker not supported');
  }
}

export default {
  name: 'service-worker',
  initialize
};
