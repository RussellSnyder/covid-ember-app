import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';

export default class IndexController extends Controller {
  countries = alias('model')
}
