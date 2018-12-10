const router = (function () {

  const PAGES_KEY = 'cbvispages';
  const PREFIX = 'compbiovis/';

  class Router {
    constructor () {
      this.pages = {
        LOGIN: `/${PREFIX}`,
        PROJECTS: `/${PREFIX}projects`,
        PROFILE: `/${PREFIX}profile`,
        ADMIN: `/${PREFIX}admin`
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
      // window.localStorage.setItem(PAGES_KEY, JSON.stringify(this.pages));
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
    field: 'createdDatetime',
    order: 'desc'
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

    deleteProject (id) {
      return this._delete(`${PROJECTS_URL}/${id}`);
    }

    getUsers (page = DEFAULT_FIRST_PROJECT_PAGE, perPage = PROJECTS_PER_PAGE) {
      return this._get(`${USERS_URL}?page=${page}&per_page=${perPage}`);
    }
  }

  return new BackendAPI();
})();

const SideMenu = (function () {

  class SideMenu {
    constructor (cfg) {
      this._cfg = cfg;
      this.handleMenuToggleBtn = this._handleMenuToggleBtn.bind(this);
      this.hanleMenuItemClick = this._handleMenuItemClick.bind(this);
      this.init();
    }

    init () {
      this._buildMenu();
      document.querySelector('.menu__toggle-btn').addEventListener('click', this.handleMenuToggleBtn);
    }

    _handleMenuToggleBtn (e) {
      document.querySelector('.menu').classList.toggle('menu--expanded');
      document.querySelector('.menu__toggle-btn').classList.toggle('menu__toggle-btn--expanded');
      document.querySelector('.content-container').classList.toggle('content-container--compressed');
    }

    _handleMenuItemClick (e) {
      let i;
      let idx = parseInt(e.currentTarget.dataset.itemIdx, 10);
      let menuItems = document.querySelectorAll('.menu__item');
      for (i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('menu__item--selected');
      }
      e.currentTarget.classList.add('menu__item--selected');
      if(typeof this._cfg.items[idx].callback === 'function') {
        this._cfg.items[idx].callback(this._cfg.items[idx]);
      }
    }

    _buildMenuItemsHTML () {
      let i;
      let html = '';
      let additionalClasses = [];
      for (i = 0; i < this._cfg.items.length; i++) {
        additionalClasses = [];
        if (this._cfg.items[i].separated === true) {
          additionalClasses.push('menu__item--separated');
        }
        if (this._cfg.items[i].current === true) {
          additionalClasses.push('menu__item--selected');
        }
        html += `<div class="menu__item ${additionalClasses.join(' ')}" data-item-idx="${i}">
            <span class="menu__item__caption">${this._cfg.items[i].caption}</span>
          </div>`;
      }
      return html;
    }

    _buildMenu () {
      let i;
      let html = this._buildMenuItemsHTML();
      document.querySelector('.menu__logo').insertAdjacentHTML('afterend', html);
      let menuItems = document.querySelectorAll('.menu__item');
      for (i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', this.hanleMenuItemClick);
      }
    }

    selectItemWithIdx (idx) {
      let i;
      let menuItems = document.querySelectorAll('.menu__item');
      for (i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('menu__item--selected');
      }
      menuItems[idx].classList.add('menu__item--selected');
    }

    destroy () {
      let i;
      let menuItems = document.querySelectorAll('.menu__item');
      for (i = 0; i < menuItems.length; i++) {
        menuItems[i].removeEventListener('click', this.hanleMenuItemClick);
      }
      document.querySelector('.menu__toggle-btn').removeEventListener('ckick', this.handleMenuToggleBtn);
      this._cfg = undefined;
    }
  }

  return SideMenu;
})();

const DataTable = (function () {

  const SORTING_POSTFIXES = [
    'off',
    'asc',
    'desc'
  ];

  const SORTING_POSTFIXES_MAP = {
    off: 0,
    asc: 1,
    desc: 2
  };

  const DATA_TABLE_CLASS = 'data-table';
  const DATA_TABLE_SELECTOR = `.${DATA_TABLE_CLASS}`;
  const HEADER_ROW_SELECTOR = `.${DATA_TABLE_CLASS}__row--header`;
  const HEADER_CELLS_SELECTOR = `${HEADER_ROW_SELECTOR} .data-table__cell`;
  const ROW_SELECTOR = `.${DATA_TABLE_CLASS}__row:not(${HEADER_ROW_SELECTOR})`;
  const SORTING_POSTFIXES_TO_REMOVE = SORTING_POSTFIXES.map(e => `${DATA_TABLE_CLASS}__cell--sorted-${e}`);

  class DataTable {
    constructor (cfg = {}) {
      this._columns = cfg.columns || [];
      this._columnSortingData = [];
      this._data = undefined;
      this.handleRowClick = this._handleRowClick.bind(this);
      this.handleHeaderCellClick = this._handleHeaderCellClick.bind(this);
      this._cfg = cfg;
      this.init(cfg);
    }

    init (cfg) {
      let i, columnData;
      for (i = 0; i < cfg.columns.length; i++) {
        if (cfg.columns[i].sortable === false) {
          continue;
        }
        columnData = {
          idx: i,
          sorting: 0
        };
        if (cfg.columns[i].key === cfg.defaultSortingField) {
          columnData.sorting = SORTING_POSTFIXES_MAP[cfg.defaultSortingOrder];
        }
        this._columnSortingData.push(columnData);
      }
      this._data = cfg.data;
      this._buildFullBody();
    }

    _destroyDOM () {
      let tableDOM = document.querySelector(DATA_TABLE_SELECTOR);
      if (!tableDOM) {
        return;
      }
      let i;
      let headerCellsDOM = document.querySelectorAll(HEADER_CELLS_SELECTOR);
      let rowsDOM = document.querySelectorAll(ROW_SELECTOR);
      for (i = 0; i < headerCells.length; i++) {
        headerCells[i].removeEventListener('click', this.handleHeaderCellClick);
      }
      for (i = 0; i < rowsDOM.length; i++) {
        rowsDOM[i].removeEventListener('click', this.handleRowClick);
      }
      tableDOM.remove();
    }

    destroy () {
      this._destroyDOM();
      this._data = undefined;
      this._columnSortingData = [];
      this._columns = [];
    }

    _handleRowClick (e) {
      console.log('handling row click');
      let i = parseInt(e.currentTarget.dataset.rowIdx, 10);
      this._cfg.rowClick(this._data[i]);
    }

    _handleHeaderCellClick (e) {
      let i;
      let idx = parseInt(e.currentTarget.dataset.headerIdx, 10);
      let headerCells = document.querySelectorAll(HEADER_CELLS_SELECTOR);
      let postfix;
      for (i = 0; i < this._columnSortingData.length; i++) {
        if (this._columnSortingData[i].idx !== idx) {
          this._columnSortingData[i].sorting = 0;
        } else {
          this._columnSortingData[i].sorting = (this._columnSortingData[i].sorting + 1) % SORTING_POSTFIXES.length;
          postfix = this._columnSortingData[i].sorting;
        }
        headerCells[this._columnSortingData[i].idx].classList.remove(...SORTING_POSTFIXES_TO_REMOVE);
      }
      headerCells[idx].classList.add(`data-table__cell--sorted-${SORTING_POSTFIXES[postfix]}`);
      if (typeof this._columns[idx].sortingFunc === 'function') {
        this._columns[idx].sortingFunc(this._columns[idx], SORTING_POSTFIXES[postfix]);
      }
    }

    _buildTableHeaderHTML (columns) {
      let i;
      let html = '<div class="data-table__row data-table__row--header">';
      for (i = 0; i < columns.length; i++) {
        html += `<div class="data-table__cell" title="${columns[i].name}" data-header-idx="${i}"><span class="cell-content">${columns[i].name}</span></div>`;
      }
      html += '</div>';
      return html;
    }

    _buildTableBodyHTML (rows) {
      let i, j;
      let cellClass = '';
      let cellVal = undefined;
      let titleVal = undefined;
      let html = '';
      for (i = 0; i < rows.length; i++) {
        html += `<div class="data-table__row" data-row-idx="${i}">`;
        for (j = 0; j < this._columns.length; j++) {
          cellClass = this._columns[j].cellClass || '';
          if (typeof this._columns[j].insertionFunc === 'function') {
            cellVal = this._columns[j].insertionFunc(rows[i], this._columns[j]);
          } else {
            cellVal = escape(rows[i][this._columns[j].key]);
          }
          if (typeof this._columns[j].titleFunc === 'function') {
            titleVal = this._columns[j].titleFunc(rows[i], this._columns[j]);
          } else {
            titleVal = escape(rows[i][this._columns[j].key] || '');
          }
          html +=
            `<div class="data-table__cell ${cellClass}" title="${titleVal}">${cellVal}</div>`;
        }
        html += '</div>';
      }
      return html;
    }

    _rebuildTableBody (rows) {
      let i;
      let bodyHTML = this._buildTableBodyHTML(rows);
      let rowsDOM = document.querySelectorAll(ROW_SELECTOR);
      let t = new Date();
      for (i = 0; i < rowsDOM.length; i++) {
        rowsDOM[i].removeEventListener('click', this.handleRowClick);
        rowsDOM[i].remove();
      }
      document.querySelector(DATA_TABLE_SELECTOR).insertAdjacentHTML('beforeend', bodyHTML);
      if (typeof this._cfg.rowClick === 'function') {
        rowsDOM = document.querySelectorAll(ROW_SELECTOR);
        for (i = 0; i < rowsDOM.length; i++) {
          rowsDOM[i].addEventListener('click', this.handleRowClick);
        }
      }
      console.log(new Date() - t);
    }

    _buildFullBody () {
      let i, rowsDOM, headerCellsDOM;
      let html = `<div class="data-table ${this._cfg.bodyClass}">`;
      if (this._cfg.header !== undefined) {
        html += `<div class="data-table__header">${this._cfg.header}</div>`;
      }
      html += this._buildTableHeaderHTML(this._columns);
      html += this._buildTableBodyHTML(this._data);
      html += '</div>';
      this._destroyDOM();
      document.querySelector(this._cfg.tableContainerSelector).insertAdjacentHTML('beforeend', html);
      headerCellsDOM = document.querySelectorAll('.data-table__row--header .data-table__cell');
      for (i = 0; i < this._columnSortingData.length; i++) {
        headerCellsDOM[this._columnSortingData[i].idx].addEventListener('click', this.handleHeaderCellClick);
      }
      if (typeof this._cfg.rowClick === 'function') {
        rowsDOM = document.querySelectorAll(ROW_SELECTOR);
        for (i = 0; i < rowsDOM.length; i++) {
          rowsDOM[i].addEventListener('click', this.handleRowClick);
        }
      }
    }

    get data () {
      return this._data;
    }

    set data (data) {
      this._data = data;
      this._rebuildTableBody(data);
    }

    getCurrentSorting () {
      let i;
      let sorting = {
        field: '',
        order: ''
      };
      for (i = 0; i < this._columnSortingData.length; i++) {
        if (this._columnSortingData[i].sorting > 0) {
          sorting.field = this._columns[this._columnSortingData[i].idx].key;
          sorting.order = SORTING_POSTFIXES[this._columnSortingData[i].sorting];
          break;
        }
      }
      return sorting;
    }
  }

  return DataTable;
})();

const TextInput = (function () {

  class TextInput {
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

  return TextInput;
})();

const utils = (function () {

  class Utils {
    constructor () {

    }

    formatUnixDate (timestamp) {
      let date = new Date(timestamp);
      let minutes = date.getMinutes();
      let hours = date.getHours();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
    }

    formatZuluTime (zuluDateString) {
      let date = new Date(zuluDateString);
      let minutes = date.getMinutes();
      let hours = date.getHours();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
    }
  }

  return new Utils();
})();

const SharedList = (function () {

  const SHOW_MORE_NAME = 'Show More'; // for localization purposes
  const SHOW_LESS_NAME = 'Show Less';

  class SharedList {
    constructor (cfg) {
      this._model = {
        list: []
      };
      this._DOM = undefined;
      this.handleShowMoreClick = this._handleShowMoreClick.bind(this);
      this.init(cfg);
    }

    _buildHTML (list = []) {
      let i;
      let html =
        `<div class="shared-list">
          <div class="shared-list__container">`;
      for (i = 0; i < list.length; i++) {
        html += `<div class="shared-list__item">${list[i]}</div>`;
      }
      html +=
        `</div>
        <div class="shared-list__show-more">${SHOW_MORE_NAME}</div>
        </div>`;
      return html;
    }

    _rebuildList (list = []) {
      let i;
      let html = '';
      for (i = 0; i < list.length; i++) {
        html += `<div class="shared-list__item">${list[i]}</div>`;
      }
      this._DOM.querySelector('.shared-list__container').innerHTML = html;
    }

    _handleShowMoreClick () {
      let container = this._DOM.querySelector('.shared-list__container');
      container.classList.toggle('shared-list__container--expanded');
      if (container.classList.contains('shared-list__container--expanded')) {
        this._DOM.querySelector('.shared-list__show-more').textContent = SHOW_LESS_NAME;
      } else {
        this._DOM.querySelector('.shared-list__show-more').textContent = SHOW_MORE_NAME;
      }
    }

    set list (v) {
      this._model.list = v;
      this._rebuildList(v);
    }

    destroy () {
      this._DOM.querySelector('.shared-list__show-more').removeEventListener('click', this.handleShowMoreClick);
      this._DOM = undefined;
    }

    init (cfg) {
      let html = this._buildHTML();
      document.querySelector(cfg.containerSelector).insertAdjacentHTML('beforeend', html);
      this._DOM = document.querySelector('.shared-list');
      this._DOM.querySelector('.shared-list__show-more').addEventListener('click', this.handleShowMoreClick);
    }
  }

  return SharedList;
})();

const EntitiesDownloader = (function () {

  class EntitiesDownloader {
    constructor (cfg) {
      this._model = {
        entities: '',
        projectName: ''
      };
      this._DOM = undefined;
      this.init(cfg);
    }

    setEntities (entities, projectName) {
      this._model.entities = entities;
      this._model.projectName = projectName;
      let fileName = `${projectName}_Entities.txt`;
      let btn = this._DOM.querySelector('.entities-downloader__btn');
      if (typeof entities !== 'string' || entities.length === '') {
        btn.textContent = '';
        btn.removeAttribute('href');
        btn.removeAttribute('download');
      } else {
        let blob = new Blob(
          [entities],
          {
            type: 'text/plain;charset=utf-8'
          }
        );
        btn.href = URL.createObjectURL(blob);
        btn.setAttribute('download', fileName);
        btn.textContent = fileName;
      }
    }

    destroy () {
      this._DOM.remove();
      this._DOM = undefined;
    }

    init (cfg) {
      let html = '<div class="entities-downloader__wrapper"><a class="entities-downloader__btn"></a></div>';
      document.querySelector(cfg.containerSelector).insertAdjacentHTML('beforeend', html);
      this._DOM = document.querySelector('.entities-downloader__wrapper');
    }
  }

  return EntitiesDownloader;
})();

const entitiesList = (function () {

  class EntitiesList {
    constructor () {
      this._model = {
        entities: [],
        projectName: '',
        visible: false
      };
      this._DOM = undefined;
      this.handleCloseBtnClick = this._handleCloseBtnClick.bind(this);
    }

    _buildHTML () {
      let html = `<div class="entities-list">
        <div class="entities-list__head">
          <div class="entities-list__header">Entities List</div>
          <div class="entities-list__project-name"></div>
          <div class="entities-list__close-btn"></div>
        </div>
        <div class="entities-list__items"></div>
      </div>`;
      return html;
    }

    init () {
      let html = this._buildHTML();
      document.body.insertAdjacentHTML('beforeend', html);
      this._DOM = document.querySelector('.entities-list');
      this._DOM.querySelector('.entities-list__close-btn').addEventListener('click', this.handleCloseBtnClick);
    }

    _handleCloseBtnClick (e) {
      this.visible = false;
    }

    setEntities (entities, projectName) {
      let i;
      if (!entities) {
        return;
      }
      if (typeof entities === 'string') {
        entities = entities.split('\n');
      }
      this._model.entities = entities;
      this._model.projectName = projectName;
      let itemsHTML = '';
      for (i = 0; i < entities.length; i++) {
        itemsHTML += `<div class="entities-list__item">${entities[i]}</div>`;
      }
      this._DOM.querySelector('.entities-list__items').innerHTML = itemsHTML;
      this._DOM.querySelector('.entities-list__project-name').textContent = projectName;
    }

    get visible () {
      return this._model.visible;
    }

    set visible (v) {
      this._model.visible = v;
      if (v === true) {
        this._DOM.classList.add('entities-list--visible');
      } else {
        this._DOM.classList.remove('entities-list--visible');
      }
    }

    toggle () {
      this.visible = !this.visible;
    }
  }

  return new EntitiesList();
})();

const ProjectDescription = (function () {

  const PROJECT_STATUSES = [
    'completed',
    'failed',
    'submitted',
    'shared'
  ];

  const PROJECT_STATUSES_MAP = PROJECT_STATUSES.reduce((a, s) => {
    a[s.toUpperCase()] = s;
    return a;
  }, {});
  const STATUS_CLASS_VALUE_TO_REMOVE = PROJECT_STATUSES.map(s => `project-status--${s}`);

  class ProjectDescription {
    constructor () {
      this._savedBackendData = undefined;
      this._model = {

      };
      this.sharedList = new SharedList({
        containerSelector: '.js-shared-list-wrapper'
      });
      this.entitiesDownloader = new EntitiesDownloader({
        containerSelector: '.js-entities-downloader-container'
      });
      this.handleDeleteClick = this._handleDeleteClick.bind(this);
      this.handleShowEntitiesClick = this._handleShowEntitiesClick.bind(this);
      this.init();
    }

    init () {
      // this probably should be generated by the component itself
      // so each instance has it's own DOM
      this.DOM = document.querySelector('.js-project-description-container');
      this.DOM.querySelector('.js-proj-desc-delete').addEventListener('click', this.handleDeleteClick);
      this.DOM.querySelector('.js-proj-desc-entities').addEventListener('click', this.handleShowEntitiesClick);
    }

    setData (data) {
      this._savedBackendData = data;
      this.name = data.name;
      this.submissionDate = data.createdDatetime;
      this.submittedBy = data.authorName;
      this.status = data.status;
      this.setEntities(data.entities, data.name);
      this.entitiesNum = data.entitiesNum;
      this.context = data.context;
      this.conceptsNum = data.conceptsNum;
      this.sharedTo = data.sharedTo;
    }

    set name (v) {
      let escaped = escape(v);
      this._model.name = escaped;
      let cell = this.DOM.querySelector('.js-project-description-header');
      cell.textContent = escaped;
      cell.title = escaped;
    }

    set submissionDate (v) {
      this._model.submissionDate = v;
      let formattedDate = utils.formatZuluTime(v);
      let cell = this.DOM.querySelector('.js-project-submission-date');
      cell.textContent = formattedDate;
      cell.title = formattedDate;
    }

    set submittedBy (v) {
      let escaped = escape(v);
      this._model.submittedBy = escaped;
      let cell = this.DOM.querySelector('.js-project-author');
      cell.textContent = escaped;
      cell.title = escaped;
    }

    set status (v) {
      let i;
      let escaped = escape(v);
      this._model.status = escaped;
      let projectStatusCell = this.DOM.querySelector('.js-project-status');
      projectStatusCell.textContent = escaped;
      projectStatusCell.classList.remove(...STATUS_CLASS_VALUE_TO_REMOVE);
      projectStatusCell.classList.add(`project-status--${escaped}`);
      projectStatusCell.title = escaped;
      let buttonsBlock = this.DOM.querySelector('.js-project-desc-button-block');
      let buttons = buttonsBlock.querySelectorAll('.button');
      for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('hidden');
      }
      let entitiesButton = buttonsBlock.querySelector('.js-proj-desc-entities');
      let visualizeButton = buttonsBlock.querySelector('.js-proj-desc-vis');
      let shareButton = buttonsBlock.querySelector('.js-proj-desc-share');
      let deleteButton = buttonsBlock.querySelector('.js-proj-desc-delete');
      if (escaped === PROJECT_STATUSES_MAP.COMPLETED) {
        entitiesButton.classList.remove('hidden');
        visualizeButton.classList.remove('hidden');
        shareButton.classList.remove('hidden');
        deleteButton.classList.remove('hidden');
      } else if (escaped === PROJECT_STATUSES_MAP.FAILED || escaped === PROJECT_STATUSES_MAP.SUBMITTED) {
        entitiesButton.classList.remove('hidden');
        deleteButton.classList.remove('hidden');
      } else {
        entitiesButton.classList.remove('hidden');
      }
    }

    set entitiesNum (v) {
      this._model.entitiesNum = v;
      this.DOM.querySelector('.js-project-entities-num').textContent = v;
    }

    set context (v) {
      let escaped = escape(v);
      this._model.context = escaped;
      let cell = this.DOM.querySelector('.js-project-desc-context');
      // cell.textContent = escape(escaped);
      // cell.title = escape(escaped);
      cell.textContent = v;
      cell.title = v;
    }

    set conceptsNum (v) {
      this._model.conceptsNum = v;
      this.DOM.querySelector('.js-project-concepts-num').textContent = v;
    }

    set sharedTo (v) {
      this.sharedList.list = v;
    }

    setEntities (entities, projectName) {
      this.entitiesDownloader.setEntities(entities, projectName);
      entitiesList.setEntities(this._savedBackendData.entities, this._savedBackendData.name);
    }

    show () {
      this.DOM.classList.remove('hidden');
    }

    hide () {
      this.DOM.classList.add('hidden');
    }

    _handleShowEntitiesClick () {
      entitiesList.toggle();
    }

    _handleDeleteClick (e) {
      backendAPI.deleteProject(this._savedBackendData.id)
      .then(resp => {
        console.log(resp);
        alert('deleted');
      });
    }
  }

  return ProjectDescription;
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

const DEFAULT_MENU_CONFIG = {
  items: [
    {
      caption: 'Projects',
      callback: () => {
        router.navigate(router.pages.PROJECTS);
      }
    },
    {
      caption: 'Profile',
      callback: () => {
        router.navigate(router.pages.PROFILE);
      }
    },
    {
      caption: 'Admin Settings',
      callback: () => {
        router.navigate(router.pages.ADMIN);
      }
    },
    {
      caption: 'Logout',
      separated: true,
      callback: () => {
        userData.flush();
        router.flush();
        backendAPI.flush();
        router.navigate(router.pages.LOGIN, true);
      }
    },
  ]
};

const projectsPage = (function () {

  const PROJECT_STATUSES = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    SUBMITTED: 'submitted',
    SHARED: 'shared'
  };

  const DEFAULT_SORTING = {
    field: 'createdDatetime',
    order: 'asc'
  };

  class ProjectsPage {
    constructor () {
      this._model = {
        visible: true,
        projectForm: {
          visible: false,
          entitiesNum: 0,
          pubMedVersion: '',
          inputDataVersion: ''
        }
      };
      this.nameInput = undefined;
      this.conceptsNumInput = undefined;
      this.contextInput = undefined;
      this.entitiesInput = undefined;
      this.sideMenuComponent = undefined;
      this.dataTable = undefined;
      this.projectDescription = undefined;
      this.defaultSortingFunc = this._defaultSortingFunc.bind(this);
      this.handleSubmitForm = this._handleSubmitForm.bind(this);
      this.handleCancelForm = this._handleCancelForm.bind(this);
      this.handleOpenProjectForm = this._handleOpenProjectForm.bind(this);
      this.handleEntitiesFileUpload = this._handleEntitiesFileUpload.bind(this);
      this.handleNavigateBackBtnClick = this._handleNavigateBackBtnClick.bind(this);
      this.handleRowClick = this._handleRowClick.bind(this);
      this.dataTableRebuildCallback = this._dataTableRebuildCallback.bind(this);
      window.onload = () => this.init();
    }

    init () {
      router.init();
      entitiesList.init();
      if (!backendAPI.isAuthTokenPresent()) {
        if (router.pages.LOGIN !== '') {
          router.navigate(router.pages.LOGIN, true);
        } else {
          router.navigate('../', true);
        }
        return;
      }
      this.projectDescription = new ProjectDescription();
      this.nameInput = new TextInput('.js-project-name');
      this.conceptsNumInput = new TextInput('.js-concepts-number');
      this.contextInput = new TextInput('.js-project-context');
      this.entitiesInput = new TextInput('.js-entities-list');
      this.sideMenuComponent = new SideMenu(DEFAULT_MENU_CONFIG);
      this.sideMenuComponent.selectItemWithIdx(0);
      this.bindEventListeners();
      backendAPI.getProjects()
        .then(resp => {
          // let resp = {
          //   data: [],
          //   total: 0
          // };
          // let i, p, k;
          // let statuses = ['completed', 'failed', 'submitted'];
          // let submitters = ['John Johnson', 'Sean Parker', 'John Golt', 'Nicholas Muller', 'Casey Johns', 'Jimmy Johnes', 'Martha Stewart'];
          // let emails = [
          //   'nikita_agafonov@epam.com',
          //   'nikita_agafonov@epam.com',
          //   'nikita_agafonov@epam.com',
          //   'nikita_agafonov@epam.com',
          //   'nikita_agafonov@epam.com',
          //   'nikita_agafonov@epam.com',
          //   'martha_stewart@epam.com'
          // ];
          // for (i = 0; i < 30; i++) {
          //   k = (Math.random() * submitters.length) | 0;
          //   p = {
          //     id: i,
          //     name: `Appoptosis_${k}`,
          //     status: statuses[(Math.random() * statuses.length) | 0],
          //     conceptsNum: (Math.random() * 200) | 0,
          //     context: 'AACT, AGTA',
          //     entitiesNum: (Math.random() * 200) | 0,
          //     submittedBy: emails[k],
          //     createdDate: new Date().getTime() + ((Math.random() * 1000) | 0)
          //   }
          //   resp.data.push(p);
          //   resp.total++;
          // }
          console.log('projects', resp);
          this.dataTable = new DataTable({
            tableContainerSelector: '.content-container',
            bodyClass: 'project-page-data-table',
            defaultSortingField: 'createdDatetime',
            defaultSortingOrder: 'desc',
            header: 'All Projects',
            rowClick: this.handleRowClick,
            bodyRebuildCallback: this.dataTableRebuildCallback,
            columns: [
              {
                name: 'Project Name',
                key: 'name',
                cellClass: 'data-table__cell--bold',
                sortingFunc: this.defaultSortingFunc
              },
              {
                name: 'Status',
                key: 'status',
                cellClass: 'data-table__cell--bold',
                insertionFunc: (row, columnCfg) => {
                  let user = userData.getUser();
                  let status = row.status;
                  if (row.authorEmail.toLowerCase() !== user.email.toLowerCase()) {
                    status = PROJECT_STATUSES.SHARED;
                  }
                  return `<span class="project-status project-status--${status}">${status}</span>`;
                },
                sortingFunc: this.defaultSortingFunc
              },
              {
                name: '# Entities',
                key: 'entitiesNum',
                sortingFunc: this.defaultSortingFunc
              },
              {
                name: 'Context',
                key: 'context',
                sortable: false
              },
              {
                name: '# Concepts',
                key: 'conceptsNum',
                sortingFunc: this.defaultSortingFunc
              },
              {
                name: 'Submitted By',
                key: 'authorName',
                titleFunc: (row, columnCfg) => {
                  return row.authorName;
                },
                insertionFunc: (row, columnCfg) => {
                  return row.authorName;
                },
                sortingFunc: this.defaultSortingFunc
              },
              {
                name: 'Submission Date',
                key: 'createdDatetime',
                insertionFunc: (row, columnCfg) => {
                  // return utils.formatUnixDate(row.submissionDate);
                  return utils.formatZuluTime(row.createdDatetime);
                },
                sortingFunc: this.defaultSortingFunc
              },
              {
                name: 'Actions',
                sortable: false,
                cellClass: 'data-table__cell--max-width-264',
                insertionFunc: (row, columnCfg) => {
                  let user = userData.getUser();
                  let cellHTML =
                    `<div class="actions-wrapper"><span class="button button--tag button--blue">Entities</span>`;
                  if (row.authorEmail.toLowerCase() === user.email.toLowerCase()) {
                    if (row.status === PROJECT_STATUSES.COMPLETED) {
                      cellHTML +=
                        `<span class="button button button--tag button--violet">Visualize</span>
                        <span class="button button button--tag button--violet-transparent">Share</span>`;
                    }
                    cellHTML +=
                      `<span class="button button--trash button--tag button--violet-transparent">x</span>`;
                  } else {
                    cellHTML += `<span class="button button button--tag button--violet">Visualize</span>`;
                  }
                  cellHTML += '</div>';
                  return cellHTML;
                }
              }
            ],
            data: resp.data
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    set visible (v) {
      this._model.visible = v;
      if (v === true) {
        document.querySelector('.content-container__header').classList.remove('hidden');
        document.querySelector('.js-open-project-form').classList.remove('hidden');
        document.querySelector('.project-page-data-table').classList.remove('hidden');
        // document.querySelector('.js-project-form').classList.remove('hidden');
        this.reloadDataTableWithCurrentSorting();
      } else {
        document.querySelector('.content-container__header').classList.add('hidden');
        document.querySelector('.js-open-project-form').classList.add('hidden');
        document.querySelector('.project-page-data-table').classList.add('hidden');
        document.querySelector('.js-project-form').classList.add('hidden');
      }
    }

    get projectFormVisible () {
      return this._model.projectForm.visible;
    }

    set projectFormVisible (v) {
      this._model.projectForm.visible = v;
      if (v === true) {
        document.querySelector('.js-project-form').classList.remove('hidden');
        document.querySelector('.js-open-project-form').classList.add('hidden');
      } else {
        document.querySelector('.js-project-form').classList.add('hidden');
        document.querySelector('.js-open-project-form').classList.remove('hidden');
      }
    }

    _defaultSortingFunc (columnCfg, order) {
      let field = columnCfg.key;
      if (order === 'off') {
        field = DEFAULT_SORTING.field;
        order = DEFAULT_SORTING.order;
      }
      backendAPI.getProjects({
        field,
        order
      }).then(resp => {
        this.dataTable.data = resp.data;
      });
    }

    _handleSubmitForm () {
      let projectDescription = {
        name: this.nameInput.val,
        conceptsNum: this.conceptsNumInput.val,
        context: this.contextInput.val,
        entities: this.entitiesInput.val,
        entitiesNum: this.entitiesInput.val.split('\n').length,
        pubMedVersion: '',
        inputDataVersion: ''
      };
      backendAPI.createProject(projectDescription)
        .then(resp => {
          this.nameInput.val = '';
          this.conceptsNumInput.val = '';
          this.contextInput.val = '';
          this.entitiesInput.val = '';
          this.entitiesInput.val = '';
          this.reloadDataTableWithCurrentSorting();
        });
    }

    _handleCancelForm () {
      this.projectFormVisible = false;
    }

    _handleOpenProjectForm () {
      this.projectFormVisible = true;
    }

    _handleEntitiesFileUpload (e) {
      let extension = e.currentTarget.files[0].name.split('.')[1];
      if (extension !== 'csv' && extension !== 'txt') {
        return;
      }
      let freader = new FileReader();
      freader.onload = (readResult) => {
        this.entitiesInput.val = readResult.target.result;
      };
      freader.readAsText(e.currentTarget.files[0]);
    }

    _handleRowClick (row) {
      backendAPI.getProject(row.id)
      .then(project => {
        if (project.sharedTo.length === 0) {
          project.sharedTo = ['asdf@email.com', 'asdf@email.com', 'asdf@email.com', 'asdf@email.com', 'asdf@email.com', 'asdf@email.com'];
        }
        this.projectDescription.setData(project);
        document.querySelector('.internal-page-container').classList.remove('hidden');
        this.visible = false;
        console.log(project);
      });
    }

    _handleNavigateBackBtnClick (e) {
      e.currentTarget.parentElement.classList.add('hidden');
      this.visible = true;
      entitiesList.visible = false;
    }

    _dataTableRebuildPreparation () {

    }

    _dataTableRebuildCallback () {

    }

    reloadDataTableWithCurrentSorting () {
      let sorting = this.dataTable.getCurrentSorting();
      backendAPI.getProjects({
        field: sorting.field,
        order: sorting.order
      }).then(resp => {
        this.dataTable.data = resp.data;
      });
    }

    bindEventListeners () {
      document.querySelector('.js-open-project-form').addEventListener('click', this.handleOpenProjectForm);
      document.querySelector('.js-submit-form').addEventListener('click', this.handleSubmitForm);
      document.querySelector('.js-cancel-form').addEventListener('click', this.handleCancelForm);
      document.querySelector('.js-entities-file-input').addEventListener('change', this.handleEntitiesFileUpload);
      document.querySelector('.navigation__back-btn-wrapper').addEventListener('click', this.handleNavigateBackBtnClick);
    }
  }

  return new ProjectsPage();
})();

export default projectsPage;
