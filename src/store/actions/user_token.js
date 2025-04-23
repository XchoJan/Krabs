export const USER_TOKEN = 'USER_TOKEN';

export function setUserToken(user_token) {
  return {
    type: USER_TOKEN,
    payload: {
      user_token,
    },
  };
}

export const DELETE_TOKEN = 'DELETE_TOKEN';

export function deleteUserToken() {
  return {
    type: DELETE_TOKEN,
  };
}
