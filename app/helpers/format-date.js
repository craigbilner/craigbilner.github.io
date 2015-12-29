import Ember from 'ember';
import moment from 'moment';

export default Ember.Helper.helper(params => {
  return moment(new Date(params[0])).format('DD MMMM');
});
