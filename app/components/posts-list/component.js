import Ember from 'ember';

export default Ember.Component.extend({
  sortPosts(prev, next) {
    return new Date(next.get('created')) - new Date(prev.get('created'));
  },
  updateModel() {
    this.set('summaryPosts', this.posts.toArray().sort(this.sortPosts));
  },
  didReceiveAttrs() {
    this.updateModel();
  },
  willUpdate(){
    this.updateModel();
  }
});
