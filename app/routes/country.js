import Route from '@ember/routing/route';
import fetch from 'fetch';
import config from '../../config/environment'

export default class CountryRoute extends Route {
  async model(params) {
    const { country_name: countryName } = params

    const response = await fetch(`${config.API_ENPOINT}/api/country/${countryName}`);
    const data = await response.json();
    return { data, countryName }
  }
}
