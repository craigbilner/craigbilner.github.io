import Ember from 'ember';

let dataSubscribers = [];
let routeSubscribers = [];
const BLOG_URL = 'https://api.cosmicjs.com/v1/blog-cb/objects';
const BUST_CACHE = '?bustcache=true';
let isBusting = false;

function handleFetch (response) {
  const responseClone = response.clone();
  if (responseClone.ok) {
    return responseClone.json().then(jsonResponse => jsonResponse);
  } else {
    throw new Error('Network response was not ok.');
  }
}

function handleError (error) {
  console.error('There has been a problem with your fetch operation', error);
}

function getPost (slug, posts) {
  return new Promise((res, rej) => {
    const thisPost = posts.filter(post => post.slug === slug);

    if (thisPost.length) {
      res(thisPost[0]);
    } else {
      rej();
    }
  });
}

function updateStore (post) {
  routeSubscribers.map(subscriber => {
    subscriber(post);
  });
  routeSubscribers = [];
}

export default Ember.Service.extend({
  subscribe(func) {
    routeSubscribers.push(func);
  },
  fetch() {
    if ('serviceWorker' in navigator && navigator.onLine) {
      setTimeout(() => {
        isBusting = true;
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch)
          .then(json => {
            isBusting = false;
            dataSubscribers.map(subscriber => {
              subscriber(json.objects);
            });
            dataSubscribers = [];
          })
          .catch(handleError);
      }, 0);
    }
    return fetch(BLOG_URL)
      .then(handleFetch)
      .catch(handleError);
  },
  fetchAndPush(slug) {
    return new Promise((res, rej) => {
      if (isBusting) {
        dataSubscribers.push(function (posts) {
          getPost(slug, posts)
            .then(updateStore)
            .then(res)
            .catch(rej)
        });
      } else {
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch)
          .then(function(data){
            return getPost(slug, data)
              .then(updateStore);
          })
          .catch(rej);
      }
    });
  }
});
