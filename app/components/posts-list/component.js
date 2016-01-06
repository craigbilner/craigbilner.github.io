import Ember from 'ember';

export default Ember.Component.extend({
  dataStore: Ember.inject.service('data-store'),
  filterPosts: Ember.inject.service('filter-posts'),
  hasPosts: true,
  classNames: ['posts-list-container'],
  classNameBindings: ['showFilterPanel:show-panel', 'showPosts:show-posts'],
  showFilterPanel: false,
  showPosts: true,
  didInitAttrs() {
    this.setPosts = this.setPosts.bind(this);
    this.get('dataStore').subscribe(this.setPosts).then(posts => {
      this.setPosts(posts);
    });

    this.filterChanged = this.filterChanged.bind(this);
    this.get('filterPosts').subscribe(this.filterChanged);

    this.togglePanel = this.togglePanel.bind(this);
    this.get('filterPosts').subscribeToPanel(this.togglePanel);

    this.transitionEnd = this.transitionEnd.bind(this);
  },
  setPosts(posts) {
    this.set('posts', posts);
    this.filterChanged();
  },
  setFilteredPosts(posts) {
    const filteredPosts = posts.toArray().sort(this.sortPosts);
    this.set('filteredPosts', filteredPosts);
    this.set('hasPosts', filteredPosts.length > 0);
  },
  filterChanged() {
    this.setFilteredPosts(this.get('filterPosts').filter(this.posts));
  },
  sortPosts(prev, next) {
    return new Date(next.get('created')) - new Date(prev.get('created'));
  },
  togglePanel(state) {
    this.set('showFilterPanel', state);
    if (!state) {
      this.set('showPosts', true);
    }
  },
  didRender() {
    this.element.addEventListener('transitionend', this.transitionEnd);
  },
  transitionEnd() {
    this.set('showPosts', !this.get('showFilterPanel'));
  },
  willDestroy() {
    this.element.removeEventListener('transitionend', this.transitionEnd);

    this.get('dataStore').unsubscribe(this.setPosts);
    this.get('filterPosts').unsubscribe(this.filterChanged);
    this.get('filterPosts').unsubscribeFromPanel(this.togglePanel);
  }
});
