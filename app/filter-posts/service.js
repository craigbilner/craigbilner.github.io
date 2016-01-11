import Ember from 'ember';

let filterSubscribers = [];
let panelSubscribers = [];

function keywordMatch(filters, content) {
  if (!filters['filterKeywords']) {
    return true;
  }

  return ~content.indexOf(filters['filterKeywords']);
}

function lengthMatch(filters, content) {
  if (!(filters['filterShort'] || filters['filterMedium'] || filters['filterLong'])) {
    return true;
  }

  return (filters['filterShort'] && content.length < 1700)
    || (filters['filterMedium'] && content.length >= 1700 && content.length < 4000)
    || (filters['filterLong'] && content.length >= 4000);
}

function categoryMatch(filters, category) {
  if (!(filters['filterQuick'] || filters['filterCode'] || filters['filterOpinion'] || filters['filterJuvenal'])) {
    return true;
  }

  return filters['filterQuick'] && category === 'qt'
    || filters['filterCode'] && category === 'c'
    || filters['filterOpinion'] && category === 'o'
    || filters['filterJuvenal'] && category === 'j';
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
  blogFilters: {},
  subscribe(func) {
    filterSubscribers.push(func);
  },
  unsubscribe(func) {
    filterSubscribers = unsubscribe(func)(filterSubscribers);
  },
  push({ key, value }) {
    if (value) {
      this.blogFilters[key] = value;
    } else {
      delete this.blogFilters[key];
    }
    this.broadcast();
  },
  broadcast() {
    filterSubscribers.forEach(func => {
      func(this.blogFilters);
    });
  },
  filter(posts) {
    return posts.filter(filterPosts(this.blogFilters));
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
  getFilters() {
    return this.blogFilters;
  },
  clear() {
    this.blogFilters = {};
    this.broadcast();
  }
});
