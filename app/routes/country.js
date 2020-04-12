import Route from '@ember/routing/route';
import fetch from 'fetch';
import { action } from '@ember/object';

export default class CountryRoute extends Route {
  @action
  setupController(controller, model) {
    controller.set('model', model);
  }


  model(params) {
    const { country_name: countryName } = params

    return fetch(`/api/country/${countryName}`).then(function(response) {
      return response.json();
    });
  }

  @action
  activate() {
    // console.log('activate refresh')
    // this.refresh()
  }
}
