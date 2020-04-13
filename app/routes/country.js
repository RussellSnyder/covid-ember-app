import Route from '@ember/routing/route';
import fetch from 'fetch';
import { action } from '@ember/object';

export default class CountryRoute extends Route {
  async model(params) {
    const { country_name: countryName } = params

    const response = await fetch(`/api/country/${countryName}`);
    const data = await response.json();
    return { data, countryName }
  }

  @action
  activate() {
    // console.log('activate refresh')
    // this.refresh()
  }
}
