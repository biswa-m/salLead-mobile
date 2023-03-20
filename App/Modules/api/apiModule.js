import api from '../../Services/Api/api';
import {store} from '../../store';
import _ from 'lodash';

const apiModule = {
  fetchMyProfile: async () => {
    const userid = store.getState()?.pState.AUTH?.user?.id;
    if (!userid) throw new Error('Not logged in');
    let user = (
      await api.request({
        uri: '/v1/data/get',
        method: 'POST',
        body: {
          filter: {where: {type: 'user', 'data.id': userid}, limit: 1},
        },
      })
    ).items?.map(x => ({...(x.data || {}), _id: x._id}))?.[0];

    let credit = await api
      .request({
        uri: '/v1/data/get',
        method: 'POST',
        body: {
          filter: {where: {type: 'credit', 'data.user': userid}, limit: 1},
        },
      })
      .then(x => x?.items?.[0])
      .then(x => ({...(x?.data || {}), _id: x?._id}));

    let today = new Date().setHours(0, 0, 0, 0);
    if (!credit?._id || !credit.lastUpdate || credit.lastUpdate < today) {
      if (credit?._id)
        await api.request({
          uri: '/v1/data/' + credit._id,
          method: 'DELETE',
        });

      credit = await api
        .request({
          uri: '/v1/data',
          method: 'POST',
          body: {
            data: {
              user: userid,
              lastUpdate: today,
              legacy: 5,
              credit: 5,
              ts: Date.now(),
            },
            type: 'credit',
          },
        })
        .then(x => x.item)
        .then(x => ({...(x?.data || {}), _id: x?._id}));
    }
    user = {...user, credit};

    return {user};
  },

  loadLeads: (opt = {}) => {
    const userid = store.getState()?.pState.AUTH?.user?.id;

    return api
      .request({
        uri: '/v1/data/get',
        method: 'POST',
        body: {
          filter: {where: {...(opt.where || {}), type: 'lead'}},
        },
      })
      .then(res =>
        res?.items
          ?.map(x => ({
            ...(x.data || {}),
            _id: x._id,
            ts: parseInt(x.data?.ts),
            sharesUserOwns: userid
              ? x.data?.shares?.filter?.(x => x.user == userid)?.length || 0
              : 0,
          }))
          .sort((a, b) => b.ts - a.ts),
      );
  },

  unlock: async ({id}) => {
    const userid = store.getState()?.pState.AUTH?.user?.id;
    if (!userid) throw new Error('You are not logged in');

    const itemP = apiModule
      .loadLeads({where: {'data.id': id}})
      .then(x => x?.[0]);
    const userP = apiModule.fetchMyProfile();

    const item = await itemP;

    if (!item?.id) throw new Error('Invalid lead id');

    if (item.sharesUserOwns > 0) {
      throw new Error('You have already unlocked the lead');
    }

    if (item.sharesLeft <= 0) {
      throw new Error(
        'Sorry! This lead has already been claimed, and is no longer available.',
      );
    }

    const {user} = await userP;
    let legacyCredit = user.credit?.legacy || 0;
    let generalCredit = user.credit?.credit || 0;
    if (item.isLegacy) {
      if (legacyCredit > 0) legacyCredit--;
      else generalCredit--;
    } else {
      generalCredit--;
    }

    if (Math.min(legacyCredit, generalCredit, 0) !== 0) {
      throw new Error('You do not have enough credit left');
    }

    await api.request({
      uri: '/v1/data/' + item._id,
      method: 'PUT',
      body: {
        data: {
          ..._.omit(item, ['_id']),
          sharesLeft: Math.max(item.sharesLeft - 1, 0),
          shares: [...(item.shares || []), {user: userid, ts: Date.now()}],
        },
        type: 'lead',
      },
    });

    await api.request({
      uri: '/v1/data/' + user.credit._id,
      method: 'PUT',
      body: {
        data: {
          ..._.omit(user.credit, ['_id']),
          legacy: Math.max(0, legacyCredit),
          credit: Math.max(0, generalCredit),
          ts: Date.now(),
        },
        type: 'credit',
      },
    });
  },
};

export default apiModule;
