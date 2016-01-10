import Ember from 'ember';
import DS from 'ember-data';

function normalize (store, primaryModelClass, data, id, requestType) {
  const response = {
    posts: this.get('dorch').normalize(data)
  };

  return this._super(store, primaryModelClass, response, id, requestType);
}

export default DS.RESTSerializer.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  normalizeQueryResponse: normalize,
  normalizeFindAllResponse: normalize
});
