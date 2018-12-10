const userData = (function () {
  'use strict';

  class UserData {
    constructor () {
      this._user = undefined;
    }

    getUser () {
      if (this._user === undefined) {
        this._user = JSON.parse(window.localStorage.getItem('user'));
      }
      return this._user;
    }

    save (data) {
      window.localStorage.setItem('user', JSON.stringify(data));
      this._user = data;
    }

    flush () {
      window.localStorage.removeItem('user');
      this._user = undefined;
    }
  }

  return new UserData();
})();

export default userData;
