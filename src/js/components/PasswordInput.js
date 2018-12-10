const PasswordInput = (function () {
  'use strict';

  class PasswordInput {
    constructor (selector) {
      this._inputDOM = undefined;
      this.handleInput = this._handleInput.bind(this);
      this.init(selector);
    }

    get val () {
      return this._inputDOM.value;
    }

    set val (v) {
      this._inputDOM.value = v;
    }

    _handleInput (e) {
      console.log(e);
    }

    init (selector = '.js-password-input') {
      this._inputDOM = document.querySelector(selector);
      this._inputDOM.addEventListener('input', this.handleInput);
    }

    destroy () {
      this._inputDOM.removeEventListener('input', this.handleInput);
      this._inputDOM = undefined;
    }
  }

  return PasswordInput;
})();

export default PasswordInput;
