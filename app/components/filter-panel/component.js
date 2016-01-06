import Ember from 'ember';

export default Ember.Component.extend({
  filterPosts: Ember.inject.service('filter-posts'),
  actions: {
    filterChange(type, evt) {
      this.get('filterPosts').push({
        key: type,
        value: evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value
      });
    },
    hideFilterPanel() {
      this.get('filterPosts').hidePanel();
    }
  }
});
