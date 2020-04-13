import Route from '@ember/routing/route';
import fetch from 'fetch';
import config from 'corona-data/config/environment'

export default class IndexRoute extends Route {
  model() {
    return fetch(`${config.API_ENPOINT}/api/countries/`).then(function(response) {
      return response.json();
    });
  }
}
