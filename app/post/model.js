import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),
  created: DS.attr('string'),
  modified: DS.attr('string'),
  slug: DS.attr('string'),
  title: DS.attr('string'),
  summary: DS.attr('string'),
  tags: DS.attr('string'),
  isSelected: DS.attr('boolean')
});
