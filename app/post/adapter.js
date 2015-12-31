import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  ajax() {
    return this.get('dorch').fetch();
  }
});
