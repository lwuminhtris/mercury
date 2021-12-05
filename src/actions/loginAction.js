/* eslint-disable camelcase */
import * as types from '../constants/ActionTypes';

const ALogin = (username, page_names, page_ids) => ({
  type: types.LOGIN,
  user: {
    username,
    page_names,
    page_ids
  }
});

export default ALogin;
