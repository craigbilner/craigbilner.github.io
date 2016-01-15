import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['post-article'],
  hasLinks: false,
  didReceiveAttrs() {
    scrollTo(0, 0);

    this.set('hasLinks', !!(this.get('post').prevPost || this.get('post').nextPost));
  }
});
