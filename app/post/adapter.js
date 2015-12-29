import DS from 'ember-data';

const POSTS_URL = 'https://api.cosmicjs.com/v1/blog-cb/objects';
const BLOG_URL = POSTS_URL + '?bustcache=true';

function handleFetch (response) {
  const responseClone = response.clone();
  if (responseClone.ok) {
    return responseClone.json().then(jsonResponse => jsonResponse);
  } else {
    console.error('Network response was not ok.');
  }
}

function handleError (error) {
  console.error('There has been a problem with your fetch operation', error);
}

export default DS.JSONAPIAdapter.extend({
  ajax() {
    if ('serviceWorker' in navigator && navigator.onLine) {
      setTimeout(() => {
        fetch(BLOG_URL);
      }, 0);
    }
    return fetch(POSTS_URL)
      .then(handleFetch)
      .catch(handleError);
  }
});
