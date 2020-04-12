import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class CountryRoute extends Route {
  model(params) {
    const { country_name: countryName } = params

    console.log(params)
    return fetch(`/api/country/${countryName}`).then(function(response) {
      return response.json();
    });
  }
}
