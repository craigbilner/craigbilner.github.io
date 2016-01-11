import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['filter-panel'],
  filterPosts: Ember.inject.service('filter-posts'),
  didInitAttrs() {
    this.filterChanged = this.filterChanged.bind(this);
    this.get('filterPosts').subscribe(this.filterChanged);
  },
  filterChanged(newFilters) {
    if (!Object.keys(newFilters).length) {
      this.setProperties({
        filterKeywords: null,
        filterShort: false,
        filterMedium: false,
        filterLong: false,
        filterQuick: false,
        filterCode: false,
        filterOpinion: false
      });
    }
  },
  didReceiveAttrs() {
    this.setProperties(this.format(this.get('filterPosts').getFilters()));
  },
  formatFilter: obj => (filterObj, key) => {
    if (key === 'filterKeywords') {
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
      const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
      this.get('filterPosts').push({
        key: type,
        value
      });
      this.set(type, value);
    },
    hideFilterPanel() {
      this.get('filterPosts').hidePanel();
    }
  },
  willDestroy() {
    this.get('filterPosts').unsubscribe(this.filterChanged);
  }
});
