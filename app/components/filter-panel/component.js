import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['filter-panel'],
  filterPosts: Ember.inject.service('filter-posts'),
  didReceiveAttrs() {
    this.set('filter', this.format(this.get('filterPosts').getFilters()));
  },
  formatFilter: obj => (filterObj, key) => {
    if(key==='filterKeywords') {
      filterObj[key] = obj[key];
    } else {
      filterObj[key] = true;
    }
    return filterObj;
  },
  format(obj){
    return Object.keys(obj).reduce(this.formatFilter(obj), {});
  },
  actions: {
    filterChange(type, evt) {
      this.get('filterPosts').push({
        key: type,
        value: evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value
      });
    },
    hideFilterPanel() {
      this.get('filterPosts').hidePanel();
    }
  }
});
