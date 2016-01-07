import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-tags'],
  didReceiveAttrs() {
    const tags = this.get('tags');
    if (tags && tags.length) {
      this.set('tagList', tags.split('|'));
    }
  }
});
