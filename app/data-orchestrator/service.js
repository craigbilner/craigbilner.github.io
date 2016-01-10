import Ember from 'ember';

let dataSubscribers = [];
const BLOG_URL = 'https://api.cosmicjs.com/v1/blog-cb/objects';
const BUST_CACHE = '?bustcache=true';
let isBusting = false;

const metaFilter = key => metaField => {
  return metaField.key === key;
};

function getMeta(metaFields, key) {
  if (!metaFields || !metaFields.length) {
    return [];
  }

  const items = metaFields.filter(metaFilter(key));

  return items.length === 1 ? items[0].value : null;
}

function getSummary(metaFields) {
  return getMeta(metaFields, 'summary');
}

function getTags(metaFields) {
  return getMeta(metaFields, 'tags');
}

function getCategory(metaFields) {
  return getMeta(metaFields, 'category');
}

function handleFetch(response) {
  const responseClone = response.clone();
  if (responseClone.ok) {
    return responseClone.json().then(jsonResponse => {
      return jsonResponse.objects;
    });
  } else {
    throw new Error('Network response was not ok.');
  }
}

function handleError(error) {
  console.error('There has been a problem with your fetch operation', error);
}

export default Ember.Service.extend({
  dataStore: Ember.inject.service('data-store'),
  normalize(data) {
    return data.map(post => ({
      type: 'post',
      id: post._id,
      content: post.content,
      created: post.created ? new Date(post.created).toISOString() : null,
      modified: post.modified ? new Date(post.modified).toISOString() : null,
      slug: post.slug,
      title: post.title,
      summary: getSummary(post.metafields),
      tags: getTags(post.metafields),
      category: getCategory(post.metafields),
      isSelected: false
    }));
  },
  fetch() {
    if ('serviceWorker' in navigator && navigator.onLine) {
      setTimeout(() => {
        isBusting = true;
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch)
          .then(json => {
            isBusting = false;
            this.updateStore(json);
            dataSubscribers.map(subscriber => subscriber(json));
            dataSubscribers = [];
          })
          .catch(handleError);
      }, 0);
    }
    return fetch(BLOG_URL)
      .then(handleFetch)
      .catch(handleError);
  },
  updateStore(posts) {
    this.get('dataStore').pushPayload({
      data: this.normalize(posts)
    });
  },
  fetchAndPush() {
    return new Promise((res) => {
      if (isBusting) {
        dataSubscribers.push(res);
      } else {
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch)
          .then(res)
          .catch(handleError);
      }
    });
  }
});
