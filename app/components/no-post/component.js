import Ember from 'ember';

export default Ember.Component.extend({
  didInitAttrs(){
    console.log('didInitAttrs')
    this.sendAction('checkForPost');
  },
  didReceiveAttrs(){
    console.log('didReceiveAttrs')
  },
  willRender(){
    console.log('willRender')
  },
  didInsertElement(){
    console.log('didInsertElement')
  },
  didRender(){
    console.log('didRender')
    this.sendAction('checkForPost');
  },
  willUpdate(){
    console.log('willUpdate')
  },
  didUpdate(){
    console.log('didUpdate')
  }
});
