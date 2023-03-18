import {pick} from 'lodash';
import {store} from '../../store';

const leadModule = {
  searchLocation: async q => {
    const leads = store.getState()?.pState?.APP_DATA?.leads;
    if (!q) {
      return [];
    } else {
      let regex1 = new RegExp(`^${q}`, 'i');
      let regex2 = new RegExp(`.+${q}.*`, 'i');
      let results = {strongcity: [], state: []};

      results.strongcity.push(...leads.filter(x => regex1.test(x.city)));
      results.strongcity.push(...leads.filter(x => regex2.test(x.city)));
      results.strongcity = results.strongcity
        .filter(
          (x, i, arr) =>
            arr.findIndex(y => y.city == x.city && y.state == x.state) == i,
        )
        .filter((_, i) => i < 10)
        .map(x => ({
          ...pick(x, ['city', 'state', 'stateAbbrev']),
          address: `${x.city || ''}, ${x.state || ''}`,
        }));

        results.state.push(...leads.filter(x => regex1.test(x.state)));
        results.state.push(...leads.filter(x => regex2.test(x.state)));
        results.state = results.state
          .filter(
            (x, i, arr) =>
              arr.findIndex(y => y.city == x.city && y.state == x.state) == i,
          )
          .filter((_, i) => i < 10)
          .map(x => ({
            ...pick(x, ['city', 'state', 'stateAbbrev']),
            address: `${x.city || ''}, ${x.state || ''}`,
          }));

      return results;
    }
  },
};

export default leadModule;
