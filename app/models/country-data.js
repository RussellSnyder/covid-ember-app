import Model from '@ember-data/model';
import DS from 'ember-data';

export default class CountryDataModel extends Model {
  name = DS.attr('string')
  confirmed = DS.attr('string')
  deaths = DS.attr('string')
  recovered = DS.attr('string')
}
