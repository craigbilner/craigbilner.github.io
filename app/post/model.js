import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),
  create: DS.attr('date'),
  modified: DS.attr('date'),
  slug: DS.attr('string'),
  title: DS.attr('string'),
  tags: DS.attr('string')
});
