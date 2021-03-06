import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-controller'],
  dataStore: Ember.inject.service('data-store'),
  didInitAttrs() {
    window.scrollTo(0, 0);
  },
  didReceiveAttrs() {
    if (typeof(this.model) === 'string') {
      this.addPost = this.addPost.bind(this);
      this.get('dataStore').subscribe(this.addPost);
    } else if (this.model) {
      this.set('selectedPost', this.model);
    }
  },
  addPost(posts) {
    const selectedPost = posts.filter(post => {
      return post.get('slug') === this.model;
    }).objectAt(0);

    if (selectedPost) {
      this.set('selectedPost', selectedPost);
    }
  },
  willDestroy() {
    this.get('dataStore').unsubscribe(this.addPost);
  }
});
