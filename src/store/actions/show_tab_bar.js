export const SHOW_TAB_BAR = 'SHOW_TAB_BAR';

export function setShowTabBar(show_tab_bar) {
  return {
    type: SHOW_TAB_BAR,
    payload: {
      show_tab_bar,
    },
  };
}
