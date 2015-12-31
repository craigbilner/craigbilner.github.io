import Ember from 'ember';

export default Ember.Route.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  init() {
    // this.get('dorch').subscribe(this.addRecord.bind(this));
  },
  addRecord(newPost) {
    this.store.createRecord('post', newPost);
  },
  model({ slug }) {
    return this.store.findAll('post').then(() => {
      return this
        .store
        .filter('post', post => post.get('slug') === slug)
        .then(posts => {
          if (posts.content.length) {
            return posts;
          } else {
            return {
              slug
            };
          }
        });
    });
  }
});
