import { NEWS_ITEM, DELETE_NEWS_ITEM } from '../actions/news_item';

const initialState = {
  news_item: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEWS_ITEM: {
      const { news_item } = action.payload;
      return {
        ...state,
        news_item,
      };
    }
    case DELETE_NEWS_ITEM: {
      return {
        ...state,
        news_item: '',
      };
    }
    default: {
      return state;
    }
  }
}
