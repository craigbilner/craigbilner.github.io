import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['post-summary'],
  isQuickTip: false,
  didReceiveAttrs() {
    if (this.get('post').get('category') === 'qt') {
      this.classNames.push('quick-tip-thumb');
      this.set('isQuickTip', true);
    }
  }
});
