export const USER_DATA = 'USER_DATA';

export function setUserData(user_data) {
  return {
    type: USER_DATA,
    payload: {
      user_data,
    },
  };
}

export const DELETE_USER_DATA = 'DELETE_USER_DATA';

export function deleteUserData() {
  return {
    type: DELETE_USER_DATA,
  };
}
