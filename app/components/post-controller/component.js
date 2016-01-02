import Ember from 'ember';

export default Ember.Component.extend({
  updateModel() {
    let selectedPost;

    if (this.model.length) {
      selectedPost = this.model.filter(post => {
        return post.get('isSelected');
      }).objectAt(0);
    } else {
      selectedPost = this.model;
    }

    this.set('selectedPost', selectedPost);
  },
  didReceiveAttrs() {
    this.updateModel();
  },
  willUpdate() {
    this.updateModel();
  }
});
