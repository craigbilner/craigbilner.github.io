import Ember from 'ember';

export default Ember.Route.extend({
  model({ slug }) {
    return this.store.findAll('post').then(() => {
      return this.store.filter('post', post => {
        return post.get('slug') === slug;
      }).then(posts => {
        return posts.objectAt(0) || slug;
      });
    });
  }
});
