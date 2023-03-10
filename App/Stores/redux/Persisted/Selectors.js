/**
 * Selectors let us factorize logic that queries the state.
 *
 * Selectors can be used in sagas or components to avoid duplicating that logic.
 *
 */

export const isLoggedIn = state => {
  return !!state.pState?.AUTH?.user?.id;
};
