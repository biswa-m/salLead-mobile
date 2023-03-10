import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  setPState: ['data'],
  resetPState: null,

  setPScreenState: ['screen', 'data'],

});

export const StoreTypes = Types;
export default Creators;
