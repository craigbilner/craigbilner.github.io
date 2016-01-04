import Ember from 'ember';

const subscribers = [];
const blogFilters = {};

function keywordMatch (filters, content) {
  return false;
}

function lengthMatch (filters, content) {
  return false;
}

function categoryMatch (filters, category) {
  const isMatch =
    filters['filter-quick'] && category === 'qt'
    || filters['filter-code'] && category === 'c'
    || filters['filter-opinion'] && category === 'o';

  return isMatch;
}

const filterPosts = filters => item => {
  return !Object.keys(filters).length
    || keywordMatch(filters, item.get('content'))
    || lengthMatch(filters, item.get('content'))
    || categoryMatch(filters, item.get('category'));
};

export default Ember.Service.extend({
  subscribe(func) {
    subscribers.push(func);
  },
  push({ key, value }) {
    if (value) {
      blogFilters[key] = value;
    } else {
      delete blogFilters[key];
    }
    subscribers.forEach(func => {
      func();
    });
  },
  filter(posts) {
    return posts.filter(filterPosts(blogFilters));
  }
});
