import Ember from 'ember';

export default Ember.Component.extend({
  filterPosts: Ember.inject.service('filter-posts'),
  didInitAttrs() {
    this.get('filterPosts').subscribe(this.filterChanged.bind(this));
  },
  filterChanged() {
    this.setModel(this.get('filterPosts').filter(this.posts.toArray()).sort(this.sortPosts));
  },
  sortPosts(prev, next) {
    return new Date(next.get('created')) - new Date(prev.get('created'));
  },
  setModel(posts) {
    this.set('summaryPosts', posts);
  },
  updateModel() {
    this.setModel(this.posts.toArray().sort(this.sortPosts));
  },
  didReceiveAttrs() {
    this.updateModel();
  }
});
