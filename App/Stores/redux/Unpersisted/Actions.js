import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  setVState: ['data'],
  resetVState: null,
  setVScreenState: ['screen', 'data'],
});

export const StoreTypes = Types;
export default Creators;
