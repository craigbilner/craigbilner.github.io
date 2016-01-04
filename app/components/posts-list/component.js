import Ember from 'ember';

export default Ember.Component.extend({
  dataStore: Ember.inject.service('data-store'),
  filterPosts: Ember.inject.service('filter-posts'),
  didInitAttrs() {
    this.setPosts = this.setPosts.bind(this);
    this.get('dataStore').subscribe(this.setPosts).then(posts => {
      this.setPosts(posts);
    });

    this.filterChanged = this.filterChanged.bind(this);
    this.get('filterPosts').subscribe(this.filterChanged);
  },
  setPosts(posts) {
    this.set('posts', posts);
    this.filterChanged();
  },
  setFilteredPosts(posts) {
    this.set('filteredPosts', posts.toArray().sort(this.sortPosts));
  },
  filterChanged() {
    this.setFilteredPosts(this.get('filterPosts').filter(this.posts));
  },
  sortPosts(prev, next) {
    return new Date(next.get('created')) - new Date(prev.get('created'));
  },
  willDestroy(){
    this.get('dataStore').unsubscribe(this.setPosts);
    this.get('filterPosts').unsubscribe(this.filterChanged);
  }
});
