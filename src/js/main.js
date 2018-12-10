import login from './loginPage.js';
import projects from './projectsPage.js';

const mainModule = (function () {
  'use strict';

  class MainModule {
    constructor () {
      this._pages = [
        login,
        // projects
      ];

      window.onload = () => this.init();
    }

    init () {
      let i;
      for (i = 0; i < this._pages.length; i++) {
        this._pages[i].init();
      }
    }
  }

  return new MainModule();
})();
