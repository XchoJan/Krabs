import {  SHOW_TAB_BAR } from '../actions/show_tab_bar';

const initialState = {
  show_tab_bar: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_TAB_BAR: {
      const { show_tab_bar } = action.payload;
      return {
        ...state,
        show_tab_bar,
      };
    }
    default: {
      return state;
    }
  }
}
