import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  ajax(url) {
    const slugMatch = url.match(/:(.*)s/);
    let slug = null;
    if (slugMatch && slugMatch.length == 2) {
      slug = slugMatch[1];
    }
    return this.get('dorch').fetch(slug);
  }
});
