import { SHOP_ITEM, DELETE_SHOP_ITEM } from '../actions/shop_item';

const initialState = {
  shop_item: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOP_ITEM: {
      const { shop_item } = action.payload;
      return {
        ...state,
        shop_item,
      };
    }
    case DELETE_SHOP_ITEM: {
      return {
        ...state,
        shop_item: '',
      };
    }
    default: {
      return state;
    }
  }
}
