const keyboard = (function () {

  class Keyboard {
    constructor () {
      this.KEYS = {
        ENTER: 13
      };
    }
  }

  return new Keyboard();
})();

const router = (function () {

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

const backendAPI = (function () {

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
      } else if (resp.status === STATUS_CODES.PASS_CHANGE_REQUIRED) ; else if (resp.status === STATUS_CODES.OPERATION_PROHIBITED) ; else if (resp.status === STATUS_CODES.INTERNAL_SERVER_ERR) ; else if (resp.status === STATUS_CODES.OK) {
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
          cfg[i] = DEFAULT_GET_PROJECTS_CFG[i];
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

const EmailInput = (function () {

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

const PasswordInput = (function () {

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

const userData = (function () {

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

const loginPage = (function () {

  const FORGOT_PASSWORD_HEADER = 'Forgot Password';
  const REGULAR_HEADER = 'Sign In CompBio';
  const FORGOT_PASSWORD_SIGN_IN_CAPTION = 'Send';
  const REGULAR_SIGN_IN_CAPTION = 'Sign In';

  class LoginPage {
    constructor () {
      this._model = {
        header: '',
        signInCaption: '',
        forgotPasswordActive: false,
        signInInProgress: false
      };
      this.emailComponent = undefined;
      this.passwordComponent = undefined;
      this.handleForgotPassword = this._handleForgotPassword.bind(this);
      this.handleSignIn = this._handleSignIn.bind(this);
      this.handleKeypress = this._handleKeypress.bind(this);
      window.onload = () => this.init();
    }

    init () {
      router.init();
      this.emailComponent = new EmailInput();
      this.passwordComponent = new PasswordInput();
      this.bindEventListeners();
    }

    get signInInProgress () {
      return this._model.signInInProgress;
    }

    set signInInProgress (v) {
      this._model.signInInProgress = v;
      if (v === true) {
        document.querySelector('.js-sign-in-btn').classList.add('in-progress');
      } else {
        document.querySelector('.js-sign-in-btn').classList.remove('in-progress');
      }
    }

    get signInCaption () {
      return this._model.signInCaption;
    }

    set signInCaption (v) {
      this._model.signInCaption = v;
      document.querySelector('.js-sign-in-btn').textContent = v;
    }

    get forgotPasswordActive () {
      return this._model.forgotPasswordActive;
    }

    set forgotPasswordActive (v) {
      this._model.forgotPasswordActive = v;
      if (v === true) {
        this.header = FORGOT_PASSWORD_HEADER;
        this.signInCaption = FORGOT_PASSWORD_SIGN_IN_CAPTION;
        document.querySelector('.login-form-container').classList.add('login-form-container--forgot-password');
      } else {
        this.header = REGULAR_HEADER;
        this.signInCaption = REGULAR_SIGN_IN_CAPTION;
        document.querySelector('.login-form-container').classList.remove('login-form-container--forgot-password');
      }
    }

    get header () {
      return this._model.header;
    }

    set header (v) {
      this._model.header = v;
      document.querySelector('.login-form-container__header').textContent = v;    }

    _handleForgotPassword (e) {
      this.forgotPasswordActive = true;
    }

    _handleSignIn () {
      if (this._model.signInInProgress) {
        return;
      }
      if (this._model.forgotPasswordActive) {
        backendAPI.requestResetPassword(this.emailComponent.val);
      } else {
        backendAPI.auth(this.emailComponent.val, this.passwordComponent.val)
        .then(jsonResp => {
          console.log(jsonResp);
          if (jsonResp.token !== undefined) {
            backendAPI.saveTokenToStorage(jsonResp.token);
            userData.save(jsonResp.user);
            router.setPagePath('LOGIN', location.pathname);
            router.savePageObjectToStorage();
            router.navigate(router.pages.PROJECTS);
          }
        });
      }
      this._model.signInInProgress = true;
    }

    _handleKeypress (e) {
      if (e.which === keyboard.KEYS.ENTER) {
        this.handleSignIn();
      }
    }

    bindEventListeners () {
      document.querySelector('.js-forgot-password-btn').addEventListener('click', this.handleForgotPassword);
      document.querySelector('.js-sign-in-btn').addEventListener('click', this.handleSignIn);
      document.querySelector('.js-login-form').addEventListener('keypress', this.handleKeypress);
    }
  }

  return new LoginPage();
})();

export default loginPage;
