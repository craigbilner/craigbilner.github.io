import Ember from 'ember';

export default Ember.Component.extend({
  dorch: Ember.inject.service('data-orchestrator'),
  didReceiveAttrs() {
    this
      .get('dorch')
      .fetchAndPush(this.attrs.model.value.slug)
      .catch(() => {
        this.set('text', 'So I\'ve had a rummage around and I don\'t appear to have this post, sorry :-(');
      });
  }
});
