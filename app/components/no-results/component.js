import Ember from 'ember';

export default Ember.Component.extend({
  filterPosts: Ember.inject.service('filter-posts'),
  classNames: ['no-results'],
  actions: {
    clearFilters() {
      this.get('filterPosts').clear();
    }
  }
});
