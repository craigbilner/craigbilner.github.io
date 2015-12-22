import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeFindAllResponse(store, primaryModelClass, { objects }, id, requestType) {
    const response = {
      posts: objects.map(post => ({
        type: 'posts',
        id: post._id,
        content: post.content,
        create: new Date(post.created),
        modified: new Date(post.modified),
        slug: post.slug,
        title: post.title,
        tags: post.metafields[0].value.split('|')
      }))
    };

    return this._super(store, primaryModelClass, response, id, requestType);
  }
});
