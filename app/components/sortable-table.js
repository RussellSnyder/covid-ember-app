import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { sortBy, forEach, reverse } from 'lodash'

export default class SortableTableComponent extends Component {
  @tracked
  activeSortBy = this.args.activeSortBy || 'id';

  @tracked
  sortDirection = this.args.sortDirection || 'asc';

  get sortDirection() {
    return this.activeSortBy
  }

  get sortedData() {
    const data = [];
    let id = 0;
    forEach(this.args.data, (value, key) => {
      id++
      data.push({
        id,
        name: key,
        ...value
      })
    })

    const dataAscending = sortBy(data, this.activeSortBy);

    return this.sortDirection === 'asc' ? dataAscending : reverse(dataAscending)
  }

  @action
  sort(field) {
    const isNewSort = field !== this.activeSortBy;

    if (isNewSort) {
      this.sortDirection = 'desc'
    } else {
      this.sortDirection = this.sortDirection === 'asc'
        ? 'desc'
        : 'asc'
    }

    this.activeSortBy = field
  }

  @action
  reset() {
    this.activeSortBy = "id" 
    this.sortDirection = "asc"
  }

}
