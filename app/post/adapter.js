import DS from 'ember-data';

const URL = 'https://api.cosmicjs.com/v1/blog-cb/objects';

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
    return fetch(URL)
      .then(handleFetch)
      .catch(handleError);
  }
});
