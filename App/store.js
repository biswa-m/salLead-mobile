import configureRedux from './Stores/redux';

const x = configureRedux();

export const store = x.store;
export const persistor = x.persistor;
