import axios from 'axios';
import config from '../../Config';

const api = {
  request: ({uri, params, body, headers: headerProps, method = 'GET'}) => {
    let headers = {
      appname: config.appname,
      ...(headerProps || {}),
    };
    console.log(config.apiUrl + uri);
    return axios
      .request({
        method,
        url: config.apiUrl + uri,
        headers,
        data: body,
        params,
      })
      .then(x => x.data)
      .catch(e => {
        console.log(e);
        throw new Error(
          e?.response?.data?.message || e.message || 'Something Went Wrong',
        );
      });
  },

  get: (uri, params, opt = {}) => api.request({uri, params, ...opt}),
};

export default api;
