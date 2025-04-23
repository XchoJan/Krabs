import { DELETE_TOKEN, USER_TOKEN } from '../actions/user_token';

const initialState = {
  user_token: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_TOKEN: {
      const { user_token } = action.payload;
      return {
        ...state,
        user_token,
      };
    }
    case DELETE_TOKEN: {
      return {
        ...state,
        user_token: '',
      };
    }
    default: {
      return state;
    }
  }
}
