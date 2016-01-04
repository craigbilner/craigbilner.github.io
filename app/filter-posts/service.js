import Ember from 'ember';

let subscribers = [];
const blogFilters = {};

function keywordMatch (filters, content) {
  return filters['filter-keywords'] && ~content.indexOf(filters['filter-keywords']);
}

function lengthMatch (filters, content) {
  return (filters['filter-short'] && content.length < 1700)
    || (filters['filter-medium'] && content.length >= 1700 && content.length < 4000)
    || (filters['filter-long'] && content.length >= 4000);
}

function categoryMatch (filters, category) {
  return filters['filter-quick'] && category === 'qt'
    || filters['filter-code'] && category === 'c'
    || filters['filter-opinion'] && category === 'o';
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
  unsubscribe(func) {
    subscribers = subscribers.reduce((arr, item) => {
      if (item !== func) {
        arr.push(item);
      }
      return arr;
    }, []);
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
