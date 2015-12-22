import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: 'https://api.cosmicjs.com',
  namespace: 'v1/blog-cb',
  pathForType: () => {
    return 'objects';
  }
});
