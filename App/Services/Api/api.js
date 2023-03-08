import CookieManager from '@react-native-cookies/cookies';
import Axios from 'axios';
import qs from 'qs';

import config from '../../Config';
import {store} from '../../store';
import PersistedActions from '../../Stores/redux/Persisted/Actions';

const MAX_REQUESTS_COUNT = 15;
const INTERVAL_MS = 10;
let PENDING_REQUESTS = 0;

export const axios = Axios.create({});
axios.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
        PENDING_REQUESTS++;
        clearInterval(interval);
        resolve(config);
      }
    }, INTERVAL_MS);
  });
});
axios.interceptors.response.use(
  function (response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.resolve(response);
  },
  function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error);
  },
);

let headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

export const API_URL = config.apiUrl;

const prepareConfig = async (data, opt = {}) => {
  let {headerExcludes, responseType} = data;

  let axiosConfig = {
    headers: Object.assign({}, headers, await getHeaders(headerExcludes)),
    // withCredentials: true,
  };

  if (responseType) {
    axiosConfig.responseType = responseType;
  }

  if (opt.params) {
    axiosConfig.params = opt.params;
  }

  if (opt.data) {
    axiosConfig.data = opt.data;
  }

  return {...data, axiosConfig};
};

const handleError = (error, opt = {}) => {
  const {noRedirect = false} = opt;

  error.message = getErMsg(error);
  error.code = getErCode(error);
  console.warn(
    `Error in apicall, ${opt?.method || ''} status: ${
      error.response && error.response.status
    } message: ${getErMsg(error)}, ${opt.uri?.toString()}`,
  );
  switch (error.response && error.response.status) {
    case 401:
      !noRedirect && logoutUser();
  }
  throw error;
};

const api = {};

api.get = async (uri, params, opt = {}) => {
  let {noRedirect, axiosConfig} = await prepareConfig(opt, {params});

  console.info(opt.fullPath ? uri : API_URL + uri, axiosConfig);
  return axios
    .get(opt.fullPath ? uri : API_URL + uri, axiosConfig)
    .then(processHeader)
    .catch(e => handleError(e, {noRedirect, uri}));
};

api.post = async (uri, payload, opt = {}) => {
  let {noRedirect, axiosConfig} = await prepareConfig(opt);

  const args = [API_URL + uri, qs.stringify(payload), axiosConfig];
  return axios
    .post(...args)
    .then(processHeader)
    .catch(e => handleError(e, {noRedirect, uri, method: 'POST'}));
};

api.put = async (uri, payload, opt = {}) => {
  let {noRedirect, axiosConfig} = await prepareConfig(opt);

  return axios
    .put(API_URL + uri, payload, axiosConfig)
    .then(processHeader)
    .catch(e => handleError(e, {noRedirect, uri}));
};

api.delete = async (uri, payload, opt = {}) => {
  let {noRedirect, axiosConfig} = await prepareConfig(opt, {data: payload});

  return axios
    .delete(API_URL + uri, axiosConfig)
    .then(processHeader)
    .catch(e => handleError(e, {noRedirect, uri}));
};

api.formData = async (method, uri, payload = {}, opt = {}) => {
  let {callback, noRedirect, headerExcludes} = opt;

  if (['post', 'put'].indexOf(method) === -1) {
    throw new Error('Unsupported method');
  }
  let headers = await getHeaders(headerExcludes);
  headers['Content-Type'] = 'multipart/form-data';

  let axiosConfig = {
    headers,
    onUploadProgress: function (progressEvent) {
      if (!callback) return;

      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      callback(percentCompleted);
    },
  };

  let formData = new FormData();

  Object.keys(payload).map(key => {
    let value = payload[key];

    value =
      typeof value === 'object' && ['photo', 'file'].indexOf(key) === -1
        ? JSON.stringify(value)
        : value;

    console.warn(key, typeof value, value);

    formData.append(key, value);
  });

  return axios[method](`${API_URL}${uri}`, formData, axiosConfig)
    .then(processHeader)
    .catch(e => handleError(e, {noRedirect, uri}));
};

api.getApiUrl = () => API_URL;

const processHeader = async response => {
  let setCookies = response?.headers?.['set-cookie'];

  let cookies = {};
  let cookieFound = false;
  for (let i = 0; i < setCookies?.length; i++) {
    const x = setCookies[i];

    let y = x.split('; ');

    let z = [];
    for (let i = 0; i < y.length; i++) {
      let s1 = y[i].split(', ');
      z.push(...s1);
    }

    for (let i = 0; i < z.length; i++) {
      let [key, value] = z[i].split('=');

      if (['PHPSESSID', 'ismember'].includes(key)) {
        cookies[key] = value;
        cookieFound = true;
      }
    }

    console.log({cookies});
  }

  if (cookies) {
    console.info(cookies);
    const cookieStore = (await store.getState()?.pState?.cookieStore) || {};
    store.dispatch(
      PersistedActions.setPState({
        cookieStore: {
          ...(cookieStore || {}),
          [API_URL]: {...(cookieStore?.[API_URL] || {}), ...cookies},
        },
      }),
    );
  }

  return response;
};

export const getHeaders = async headerExcludes => {
  return headers;

  console.log(CookieManager.getFromResponse(API_URL));
  console.log(CookieManager.getAll());

  // await CookieManager.clearAll();

  console.log(CookieManager.getFromResponse(API_URL));
  console.log(CookieManager.getAll());

  const cookies =
    (await store.getState()?.pState?.cookieStore?.[API_URL]) || {};

  console.warn('Exising cookies: ', cookies);
  const promises = Object.keys(cookies).map(key =>
    CookieManager.set(API_URL, {
      name: key,
      value: cookies[key],
    }),
  );

  await Promise.all(promises);

  const updatedHeaders = {
    ...headers,
    Cookie:
      // "PHPSESSID=evoo23q1ron0vtea1tv9lc36hb; ismember=true"
      qs.stringify(cookies),
  };

  console.info(JSON.stringify({updatedHeaders}, null, 4));

  return updatedHeaders;
};

let sleep = ms => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve(true);
    }, ms),
  );
};

const getErMsg = error => {
  let erroObj = (error && error.response && error.response.data) || {};

  return erroObj.code == 500 || !(erroObj.message || error.message)
    ? 'Something went wrong'
    : erroObj.message || error.message;
};

const getErCode = error => {
  let erroObj = (error && error.response && error.response.data) || {};

  return erroObj.code;
};

const logoutUser = () => {};

export default api;
