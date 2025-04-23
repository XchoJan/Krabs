import {  ACTIVE_IMAGE } from '../actions/acitve_image';

const initialState = {
    active_image: false,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTIVE_IMAGE: {
            const { active_image } = action.payload;
            return {
                ...state,
                active_image,
            };
        }
        default: {
            return state;
        }
    }
}
