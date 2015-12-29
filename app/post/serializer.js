import DS from 'ember-data';

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

export default DS.RESTSerializer.extend({
  normalizeFindAllResponse(store, primaryModelClass, { objects }, id, requestType) {
    const response = {
      posts: objects.map(post => ({
        type: 'post',
        id: post._id,
        content: post.content,
        created: new Date(post.created).toISOString(),
        modified: new Date(post.modified).toISOString(),
        slug: post.slug,
        title: post.title,
        summary: getSummary(post.metafields),
        tags: getTags(post.metafields)
      }))
    };

    return this._super(store, primaryModelClass, response, id, requestType);
  }
});
