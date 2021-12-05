import * as types from '../constants/ActionTypes';

// const initialState = {
//   // username: '',
//   userList: []
// };

const initialState = {
  userList: []
};
export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    // if login is dispatch
    case types.LOGIN: {
      // const newUsername = [...state.username];
      // newUsername.push(action.username);
      // const newUser = [...state.userList];
      // newUser.push(action.user);
      return {
        ...state,
        // username: newUsername
        userList: action.user
      };
    }
    default:
      return state;
  }
}
