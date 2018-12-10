const EmailInput = (function () {
  'use strict';

  class EmailInput {
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

    init (selector = '.js-email-input') {
      this._inputDOM = document.querySelector(selector);
      this._inputDOM.addEventListener('input', this.handleInput);
    }

    destroy () {
      this._inputDOM.removeEventListener('input', this.handleInput);
      this._inputDOM = undefined;
    }
  }

  return EmailInput;
})();

export default EmailInput;
