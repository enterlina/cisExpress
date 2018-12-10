const router = (function () {
  'use strict';

  const PAGES_KEY = 'cbvispages';

  class Router {
    constructor () {
      this.pages = {
        LOGIN: '',
        PROJECTS: 'projects',
        PROFILE: 'profile',
        ADMIN: 'admin'
      };
    }

    init () {
      let savedPagesData = JSON.parse(window.localStorage.getItem(PAGES_KEY));
      if (savedPagesData) {
        this.pages = savedPagesData;
      }
    }

    flush () {
      window.localStorage.removeItem(PAGES_KEY);
    }

    setPagePath (pageName, path) {
      if (this.pages[pageName] === undefined) {
        return;
      }
      this.pages[pageName] = path;
    }

    savePageObjectToStorage () {
      window.localStorage.setItem(PAGES_KEY, JSON.stringify(this.pages));
    }

    navigate (pageName, replace = false) {
      if (replace) {
        location.replace(pageName);
      } else {
        location.assign(pageName);
      }
    }
  }

  return new Router();
})();

export default router;
