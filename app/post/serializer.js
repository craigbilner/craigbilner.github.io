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

function normalize(store, primaryModelClass, data, id, requestType) {
  const response = {
    posts: data.map(post => ({
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
    }))
  };

  return this._super(store, primaryModelClass, response, id, requestType);
}

export default DS.RESTSerializer.extend({
  normalizeQueryResponse: normalize,
  normalizeFindAllResponse: normalize
});
