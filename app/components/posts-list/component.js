import Ember from 'ember';

export default Ember.Component.extend({
  dataStore: Ember.inject.service('data-store'),
  filterPosts: Ember.inject.service('filter-posts'),
  hasPosts: true,
  classNames: ['posts-list'],
  classNameBindings: [
    'showFilterPanel:show-panel',
    'showPosts:show-posts',
    'showingFilterPanel:showing-panel'
  ],
  totalCount: 0,
  filteredCount: 0,
  showFilterPanel: false,
  showingFilterPanel: false,
  showPosts: true,
  noPostsFound: false,
  noQuickTipsFound: false,
  didInitAttrs() {
    this.setPosts(this.model);

    this.setPosts = this.setPosts.bind(this);
    this.get('dataStore').subscribe(this.setPosts);

    this.filterChanged = this.filterChanged.bind(this);
    this.get('filterPosts').subscribe(this.filterChanged);

    this.togglePanel = this.togglePanel.bind(this);
    this.get('filterPosts').subscribeToPanel(this.togglePanel);

    this.transitionEnd = this.transitionEnd.bind(this);
  },
  getQuickTips(post) {
    return post.get('category') === 'qt';
  },
  setPosts(posts) {
    this.set('posts', posts);
    this.set('totalCount', posts.get('length'));
    this.set('quickTips', posts.filter(this.getQuickTips));
    this.filterChanged();
  },
  setFilteredPosts(posts, quickTips) {
    const filteredPosts = posts.toArray().sort(this.sortPosts);
    const filteredQuickTips = quickTips.toArray().sort(this.sortPosts);

    this.set('filteredPosts', filteredPosts);
    this.set('filteredQuickTips', filteredQuickTips);
    this.set('hasPosts', filteredPosts.length > 0);
    this.set('filteredCount', filteredPosts.length);
    this.set('noPostsFound', filteredPosts.length === this.get('filteredQuickTips').length);
    this.set('noQuickTipsFound', !filteredQuickTips.length);
  },
  filterChanged() {
    this.setFilteredPosts(
      this.get('filterPosts').filter(this.get('posts')),
      this.get('filterPosts').filter(this.get('quickTips'))
    );
  },
  sortPosts(prev, next) {
    return new Date(next.get('created')) - new Date(prev.get('created'));
  },
  togglePanel(state) {
    this.set('showFilterPanel', state);
    if (!state) {
      this.set('showPosts', true);
      this.set('showingFilterPanel', false);
    }
  },
  didRender() {
    this.element.addEventListener('transitionend', this.transitionEnd);
  },
  transitionEnd() {
    this.set('showingFilterPanel', this.get('showFilterPanel'));
  },
  willDestroy() {
    this.element.removeEventListener('transitionend', this.transitionEnd);

    this.get('dataStore').unsubscribe(this.setPosts);
    this.get('filterPosts').unsubscribe(this.filterChanged);
    this.get('filterPosts').unsubscribeFromPanel(this.togglePanel);
  }
});
