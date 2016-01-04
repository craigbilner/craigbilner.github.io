import Ember from 'ember';

let subscribers = [];

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  subscribe(func) {
    subscribers.push(func);
    return new Promise((res, rej) => {
      this.get('store').findAll('post').then(res).catch(rej);
    });
  },
  unsubscribe(func) {
    subscribers = subscribers.reduce((arr, item) => {
      if (item !== func) {
        arr.push(item);
      }
      return arr;
    }, []);
  },
  pushPayload(payload) {
    this.get('store').pushPayload(payload);
    this.get('store').filter('post', () => true).then(posts => {
      subscribers.forEach(func => func(posts));
    });
  }
});
