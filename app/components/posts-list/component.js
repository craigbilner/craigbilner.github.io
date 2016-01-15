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
    this.setPosts = this.setPosts.bind(this);
    this.get('dataStore').subscribe(this.setPosts).then(posts => this.setPosts(posts));

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
    this.set('filteredPosts', posts);
    this.set('filteredQuickTips', quickTips);
    this.set('hasPosts', posts.length > 0);
    this.set('filteredCount', posts.length);
    this.set('noPostsFound', posts.length === quickTips.length);
    this.set('noQuickTipsFound', !quickTips.length);
  },
  filterChanged() {
    this.setFilteredPosts(
      this.get('filterPosts').filter(this.get('posts')),
      this.get('filterPosts').filter(this.get('quickTips'))
    );
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
