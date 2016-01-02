import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  ajax(url, method, { data: { slug } = {} }) {
    return this.get('dorch').fetch(slug);
  }
});
