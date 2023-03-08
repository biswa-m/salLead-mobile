import {CommonActions} from '@react-navigation/native';

let navigators = {};

const navigationModule = {
  setNavigators: function (ref, key) {
    navigators[key] = ref;
  },

  exec: function (key, args, navigatorKey = 'main') {
    return navigators[navigatorKey][key](...args);
  },

  resetStackTo: (to, params, navigatorKey = 'main') => {
    navigationModule.resetStack(
      0,
      [
        {
          name: to,
          params,
        },
      ],
      navigatorKey,
    );
  },

  resetStack: (index = 0, routes, navigatorKey = 'main') => {
    navigators[navigatorKey].dispatch(
      CommonActions.reset({
        index: 0,
        routes,
      }),
    );
  },
};

export default navigationModule;
