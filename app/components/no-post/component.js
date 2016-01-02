import Ember from 'ember';

export default Ember.Component.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  didReceiveAttrs() {
    this
      .get('dorch')
      .fetchAndPush()
      .then(() => {
        this.set('text', 'So I\'ve had a rummage around and can\'t seem to find this one.');
      });
  }
});
