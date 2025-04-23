export const SHOP_ITEM = 'SHOP_ITEM';

export function setShopItem(shop_item) {
  return {
    type: SHOP_ITEM,
    payload: {
      shop_item,
    },
  };
}

export const DELETE_SHOP_ITEM = 'DELETE_SHOP_ITEM';

export function deleteShopItem() {
  return {
    type: DELETE_SHOP_ITEM,
  };
}
