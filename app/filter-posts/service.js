import Ember from 'ember';

let filterSubscribers = [];
let panelSubscribers = [];
let blogFilters = {};

function keywordMatch(filters, content) {
  if (!filters['filter-keywords']) {
    return true;
  }

  return ~content.indexOf(filters['filter-keywords']);
}

function lengthMatch(filters, content) {
  if (!(filters['filter-short'] || filters['filter-medium'] || filters['filter-long'])) {
    return true;
  }

  return (filters['filter-short'] && content.length < 1700)
    || (filters['filter-medium'] && content.length >= 1700 && content.length < 4000)
    || (filters['filter-long'] && content.length >= 4000);
}

function categoryMatch(filters, category) {
  if (!(filters['filter-quick'] || filters['filter-code'] || filters['filter-opinion'])) {
    return true;
  }

  return filters['filter-quick'] && category === 'qt'
    || filters['filter-code'] && category === 'c'
    || filters['filter-opinion'] && category === 'o';
}

const filterPosts = filters => item => {
  if (!Object.keys(filters).length) {
    return true;
  }

  return keywordMatch(filters, item.get('content'))
    && lengthMatch(filters, item.get('content'))
    && categoryMatch(filters, item.get('category'));
};

function tellPanelSubscribers(val) {
  panelSubscribers.forEach(func => {
    func(val);
  });
}

const unsubscribe = func => subscribers => {
  return subscribers.reduce((arr, item) => {
    if (item !== func) {
      arr.push(item);
    }
    return arr;
  }, []);
};

export default Ember.Service.extend({
  subscribe(func) {
    filterSubscribers.push(func);
  },
  unsubscribe(func) {
    filterSubscribers = unsubscribe(func)(filterSubscribers);
  },
  push({ key, value }) {
    if (value) {
      blogFilters[key] = value;
    } else {
      delete blogFilters[key];
    }
    this.broadcast();
  },
  broadcast() {
    filterSubscribers.forEach(func => {
      func();
    });
  },
  filter(posts) {
    return posts.filter(filterPosts(blogFilters));
  },
  subscribeToPanel(func) {
    panelSubscribers.push(func);
  },
  unsubscribeFromPanel(func) {
    panelSubscribers = unsubscribe(func)(panelSubscribers);
  },
  showPanel() {
    tellPanelSubscribers(true);
  },
  hidePanel() {
    tellPanelSubscribers(false);
  },
  clear() {
    blogFilters = {};
    this.broadcast();
  }
});
