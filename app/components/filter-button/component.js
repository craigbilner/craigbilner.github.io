import Ember from 'ember';

export default Ember.Component.extend({
  filterPosts: Ember.inject.service('filter-posts'),
  actions: {
    showFilter() {
      this.get('filterPosts').showPanel();
    }
  }
});
