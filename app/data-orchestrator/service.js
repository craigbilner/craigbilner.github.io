import Ember from 'ember';

let dataSubscribers = [];
const BLOG_URL = 'https://api.cosmicjs.com/v1/blog-cb/objects';
const BUST_CACHE = '?bustcache=true';
let isBusting = false;

const metaFilter = key => metaField => {
  return metaField.key === key;
};

function getSummary (metaFields) {
  if (!metaFields || !metaFields.length) return [];
  return metaFields.filter(metaFilter('summary'))[0].value;
}

function getTags (metaFields) {
  if (!metaFields || !metaFields.length) return [];
  return metaFields.filter(metaFilter('tags'))[0].value;
}

const reduceSelectedPost = slug => (posts, post) => {
  post.isSelected = post.slug === slug;
  posts.push(post);
  return posts;
};

const handleFetch = slug => response => {
  const responseClone = response.clone();
  if (responseClone.ok) {
    return responseClone.json().then(jsonResponse => {
      return jsonResponse
        .objects
        .reduce(reduceSelectedPost(slug), []);
    });
  } else {
    throw new Error('Network response was not ok.');
  }
}

function handleError (error) {
  console.error('There has been a problem with your fetch operation', error);
}

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
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
      isSelected: post.isSelected
    }));
  },
  fetch(slug) {
    if ('serviceWorker' in navigator && navigator.onLine) {
      setTimeout(() => {
        isBusting = true;
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch(slug))
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
      .then(handleFetch(slug))
      .catch(handleError);
  },
  updateStore(posts) {
    this.get('store').pushPayload({
      data: this.normalize(posts)
    });
  },
  fetchAndPush() {
    return new Promise((res) => {
      if (isBusting) {
        dataSubscribers.push(res);
      } else {
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch())
          .then(res)
          .catch(handleError);
      }
    });
  }
});
