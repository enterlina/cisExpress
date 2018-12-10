const SideMenu = (function () {
  'use strict';

  class SideMenu {
    constructor () {
      this.handleMenuToggleBtn = this._handleMenuToggleBtn.bind(this);
      this.init();
    }

    init () {
      document.querySelector('.menu__toggle-btn').addEventListener('click', this.handleMenuToggleBtn);
    }

    _handleMenuToggleBtn (e) {
      document.querySelector('.menu').classList.toggle('menu--expanded');
      document.querySelector('.menu__toggle-btn').classList.toggle('menu__toggle-btn--expanded');
      document.querySelector('.content-container').classList.toggle('content-container--compressed');
    }

    destroy () {
      document.querySelector('.menu__toggle-btn').removeEventListener('ckick', this.handleMenuToggleBtn);
    }
  }

  return SideMenu;
})();

export default SideMenu;
