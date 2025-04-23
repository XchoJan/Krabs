export const FIRST_AUTH = 'FIRST_AUTH';

export function setFirstAuth(first_auth) {
  return {
    type: FIRST_AUTH,
    payload: {
      first_auth,
    },
  };
}
