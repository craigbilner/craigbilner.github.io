import Ember from 'ember';

let dataSubscribers = [];
let routeSubscribers = [];
const BLOG_URL = 'https://api.cosmicjs.com/v1/blog-cb/objects';
const BUST_CACHE = '?bustcache=true';
let isBusting = false;

const handleFetch = slug => response => {
  const responseClone = response.clone();
  if (responseClone.ok) {
    return responseClone.json().then(jsonResponse => {
      return jsonResponse.objects.reduce((posts, post) => {
        post.isSelected = post.slug === slug;
        posts.push(post);
        return posts;
      }, []);
    });
  } else {
    throw new Error('Network response was not ok.');
  }
}

function handleError (error) {
  console.error('There has been a problem with your fetch operation', error);
}

export default Ember.Service.extend({
  subscribe(func) {
    routeSubscribers.push(func);
  },
  fetch(slug) {
    if ('serviceWorker' in navigator && navigator.onLine) {
      setTimeout(() => {
        isBusting = true;
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch(slug))
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
      .then(handleFetch(slug))
      .catch(handleError);
  },
  fetchAndPush(slug) {
    return new Promise((res, rej) => {
      if (isBusting) {
        dataSubscribers.push(function (posts) {
          console.log('sub', posts);
        });
      } else {
        fetch(`${BLOG_URL}${BUST_CACHE}`)
          .then(handleFetch(slug))
          .then(function (data) {
            return getPost(slug, data)
              .then(updateStore);
          })
          .catch(rej);
      }
    });
  }
});
