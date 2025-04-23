import {  FIRST_AUTH } from '../actions/first_auth';

const initialState = {
    first_auth: false,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case FIRST_AUTH: {
            const { first_auth } = action.payload;
            return {
                ...state,
                first_auth
            };
        }
        default: {
            return state;
        }
    }
}
