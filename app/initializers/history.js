export function initialize() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}

export default {
  name: 'history',
  initialize
};
