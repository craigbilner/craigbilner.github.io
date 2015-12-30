import Ember from 'ember';
import moment from 'moment';

export default Ember.Helper.helper(params => {
  const dateToFormat = params[0];
  if (dateToFormat && dateToFormat.length) {
    return moment(new Date(params[0])).format('DD MMMM YYYY');
  } else {
    return 'NO DATE!?';
  }
});
