import Ember from 'ember';
import config from '../config/environment';

let dataSubscribers = [];
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

function sortPosts(prev, next) {
  return new Date(next.created) - new Date(prev.created);
}

function getSeqPost(fps, indx, step) {
  if ((indx + step === -1) || (indx + step === fps.length)) {
    return;
  }

  const seqPost = fps[indx + step];
  if (seqPost.category === 'qt') {
    return getSeqPost(fps, indx + step, step);
  }

  return seqPost;
}

function applyPrevNext(arr, post, indx, posts) {
  post.prevPost = getSeqPost(posts, indx, -1);
  post.nextPost = getSeqPost(posts, indx, 1);

  arr.push(post);

  return arr;
}

function mapPosts(post) {
  return {
    type: 'post',
    id: post._id,
    content: post.content,
    created: post.created ? new Date(post.created).toISOString() : null,
    modified: post.modified ? new Date(post.modified).toISOString() : null,
    slug: post.slug,
    title: post.title,
    summary: getSummary(post.metafields),
    tags: getTags(post.metafields),
    category: getCategory(post.metafields)
  };
}

function handleFetch(response) {
  const responseClone = response.clone();
  if (responseClone.ok) {
    return responseClone.json().then(jsonResponse => {
      return jsonResponse
        .objects
        .sort(sortPosts);
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
    return data
      .map(mapPosts)
      .reduce(applyPrevNext, []);
  },
  fetch() {
    if ('serviceWorker' in navigator && navigator.onLine) {
      setTimeout(() => {
        isBusting = true;
        fetch(`${config.BLOG_URL}${BUST_CACHE}`)
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
    return fetch(config.BLOG_URL)
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
        fetch(`${config.BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch)
          .then(res)
          .catch(handleError);
      }
    });
  }
});
