import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    const selectedPosts = this.model.filter(post => {
      return post.get('isSelected');
    });

    if (selectedPosts.length) {
      this.set('selectedPost', selectedPosts.objectAt(0));
    }
  }
});
