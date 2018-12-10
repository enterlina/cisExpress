import router from './router.js';

const backendAPI = (function () {
  'use strict';

  const STATUS_CODES = {
    OK: 200,
    USER_TOKEN_FAILURE: 401,
    PASS_CHANGE_REQUIRED: 402,
    OPERATION_PROHIBITED: 403,
    INTERNAL_SERVER_ERR: 500
  };

  const SORTING_ORDER = {
    ASC: 'asc',
    DESC: 'desc'
  };

  const BASE_PATH = '/api';
  const AUTH_URL = `${BASE_PATH}/auth`;
  const PROJECTS_URL = `${BASE_PATH}/projects`;
  const USERS_URL = `${BASE_PATH}/users`;

  const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';

  const DEFAULT_GET_PROJECTS_CFG = {
    page: 1,
    perPage: 30,
    field: 'project.name'
  };
  const PROJECTS_PER_PAGE = 30;
  const DEFAULT_FIRST_PROJECT_PAGE = 1;

  class BackendAPI {
    constructor () {
      this._token = undefined;
    }

    _handleResp (resp) {
      if (resp.status === STATUS_CODES.USER_TOKEN_FAILURE) {
        router.navigate(router.pages.LOGIN, true);
      } else if (resp.status === STATUS_CODES.PASS_CHANGE_REQUIRED) {

      } else if (resp.status === STATUS_CODES.OPERATION_PROHIBITED) {

      } else if (resp.status === STATUS_CODES.INTERNAL_SERVER_ERR) {

      } else if (resp.status === STATUS_CODES.OK) {
        return resp.json();
      }
      throw new Error(`${resp.status}`);
    }

    _get (path) {
      let r = new Request(path, {
        method: 'GET',
        headers: {
          'Content-Type': JSON_CONTENT_TYPE,
          'Authorization': `Bearer ${this._token}`
        }
      });
      return fetch(r)
        .then(resp => {
          return this._handleResp(resp);
        });
    }

    _post (path, body) {
      let r = new Request(path, {
        method: 'POST',
        headers: {
          'Content-Type': JSON_CONTENT_TYPE,
          'Authorization': `Bearer ${this._token}`
        },
        body: JSON.stringify(body)
      });
      return fetch(r)
        .then(resp =>  {
          return this._handleResp(resp);
        });
    }

    _put (path, body) {
      let r = new Request(path, {
        method: 'PUT',
        headers: {
         'Content-Type': JSON_CONTENT_TYPE,
          'Authorization': `Bearer ${this._token}`
        },
        body: JSON.stringify(body)
      });
      return fetch(r)
        .then(resp => {
          return this._handleResp(resp);
        });
    }

    _delete (path) {
      let r = new Request(path, {
        method: 'DELETE',
        headers: {
          'Content-Type': JSON_CONTENT_TYPE,
          'Authorization': `Bearer ${this._token}`
        }
      });
      return fetch(r)
        .then(resp => {
          return this._handleResp(resp);
        });
    }

    _composeGetProjectsCfg (cfg = {}) {
      let i;
      for (i in DEFAULT_GET_PROJECTS_CFG) {
        if (cfg[i] === undefined) {
          cfg[i] = DEFAULT_GET_PROJECTS_CFG[i]
        }
      }
      return cfg;
    }

    _getSortingOrderPrefix (order) {
      return order === SORTING_ORDER.DESC ? '-' : '';
    }

    flush () {
      window.localStorage.removeItem('token');
      this._token = undefined;
    }

    saveTokenToStorage (token) {
      window.localStorage.setItem('token', token);
    }

    isAuthTokenPresent () {
      let token = window.localStorage.getItem('token');
      if (!token) {
        return false;
      }
      this._token = token;
      return true;
    }

    auth (id, password) {
      return this._post(AUTH_URL, {
        email: id,
        password
      });
    }

    requestResetPassword (id) {
      return this._post(`${BASE_PATH}/users/${id}/request_password_reset`);
    }

    getProjects (cfg) {
      cfg = this._composeGetProjectsCfg(cfg);
      return this._get(`${PROJECTS_URL}?page=${cfg.page}&per_page=${cfg.perPage}&order_by=${this._getSortingOrderPrefix(cfg.order)}${cfg.field}`);
    }

    getProject (id) {
      return this._get(`${PROJECTS_URL}/${id}`);
    }

    createProject (project) {
      return this._post(PROJECTS_URL, project);
    }

    deleteProjects (id) {
      return this._delete(`${PROJECTS_URL}/${id}`);
    }

    getUsers (page = DEFAULT_FIRST_PROJECT_PAGE, perPage = PROJECTS_PER_PAGE) {
      return this._get(`${USERS_URL}?page=${page}&per_page=${perPage}`);
    }
  }

  return new BackendAPI();
})();

export default backendAPI;
