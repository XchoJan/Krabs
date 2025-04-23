import {combineReducers} from "redux";
import user_token from './user_token'
import user_data from './user_data'
import news_item from './news_item'
import show_tab_bar from './show_tab_bar'
import shop_item from './shop_item'
import active_image from './acitve_image'
import first_auth from './first_auth'

export default combineReducers({
  user_token,
  user_data,
  news_item,
  show_tab_bar,
  shop_item,
  active_image,
  first_auth
});
