import config from '../../../Config';

export const INITIAL_STATE = {
  HOME_SCREEN: {
    searchType: 'daily',
  },
  LOGIN_SCREEN: {},
  BROWSE_SCREEN: {location: config.initialLocation},
  APP_DATA: null,
};
