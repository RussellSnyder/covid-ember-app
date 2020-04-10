import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class IndexRoute extends Route {
  model() {
    return fetch('/api/countries/').then(function(response) {
      return response.json();
    });
  }
}
