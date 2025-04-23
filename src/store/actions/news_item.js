export const NEWS_ITEM = 'NEWS_ITEM';

export function setNewsItem(news_item) {
  return {
    type: NEWS_ITEM,
    payload: {
      news_item,
    },
  };
}

export const DELETE_NEWS_ITEM = 'DELETE_NEWS_ITEM';

export function deleteNewsItem() {
  return {
    type: DELETE_NEWS_ITEM,
  };
}
