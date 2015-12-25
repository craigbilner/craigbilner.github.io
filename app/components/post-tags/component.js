import Ember from 'ember';

export default Ember.Component.extend({
	didReceiveAttrs() {
		this.set('tagList', this.get('tags').split('|'));
	}
});
