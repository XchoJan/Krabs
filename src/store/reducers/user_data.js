import { DELETE_USER_DATA, USER_DATA } from '../actions/user_data';

const initialState = {
  user_data: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_DATA: {
      const { user_data } = action.payload;
      // console.log(user_data, 'user data from reducer');
      return {
        ...state,
        user_data,
      };
    }
    case DELETE_USER_DATA: {
      return {
        ...state,
        user_data: [],
      };
    }
    default: {
      return state;
    }
  }
}
