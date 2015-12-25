import Ember from 'ember';

export default Ember.Route.extend({
  model({ slug }) {  	
  	return this.store.findAll('post').then(() => {  		
  		return this.store.filter('post', post => post.get('slug') === slug);
  	});  	
  }  
});
