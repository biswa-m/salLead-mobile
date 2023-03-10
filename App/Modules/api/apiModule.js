import api from '../../Services/Api/api';
import {store} from '../../store';

const apiModule = {
  fetchMyProfile: async () => {
    const userid = store.getState()?.pState.AUTH?.user?.id;
    if (!userid) throw new Error('Not logged in');
    const user = (
      await api.request({
        uri: '/v1/data/get',
        method: 'POST',
        body: {
          filter: {where: {type: 'user', 'data.id': userid}, limit: 1},
        },
      })
    ).items?.map(x => ({...(x.data || {}), _id: x._id}))?.[0];
    return {user};
  },
};

export default apiModule;
