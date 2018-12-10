const DataTable = (function () {
  'use strict';

  const SORTING_POSTFIXES = [
    'off',
    'asc',
    'desc'
  ];

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
      let i;
      for (i = 0; i < cfg.columns.length; i++) {
        if (cfg.columns[i].sortable === false) {
          continue;
        }
        this._columnSortingData.push({
          idx: i,
          sorting: 0,
        });
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
      let i = parseInt(e.currentTarget.dataset.rowIdx, 10);
      this._cfg.rowClick(this._data[i]);
    }

    _handleHeaderCellClick (e) {
      let i;
      let idx = parseInt(e.currentTarget.dataset.headerIdx, 10);
      let headerCells = document.querySelectorAll(HEADER_CELLS_SELECTOR);
      for (i = 0; i < this._columnSortingData.length; i++) {
        if (i !== idx) {
          this._columnSortingData[i].sorting = 0;
        }
        headerCells[this._columnSortingData[i].idx].classList.remove(...SORTING_POSTFIXES_TO_REMOVE);
      }
      this._columnSortingData[idx].sorting = (this._columnSortingData[idx].sorting + 1) % SORTING_POSTFIXES.length;
      headerCells[idx].classList.add(`data-table__cell--sorted-${SORTING_POSTFIXES[this._columnSortingData[idx].sorting]}`)
      if (typeof this._columns[idx].sortingFunc === 'function') {
        this._columns[idx].sortingFunc(this._columns[idx], SORTING_POSTFIXES[this._columnSortingData[idx]]);
      }
    }

    _buildTableHeaderHTML (columns) {
      let i
      let html = '<div class="data-table__row data-table__row--header">';
      for (i = 0; i < columns.length; i++) {
        html += `<div class="data-table__cell" title="${columns[i].name}" data-header-idx="${i}"><span class="cell-content">${columns[i].name}</span></div>`;
      }
      html += '</div>'
      return html;
    }

    _buildTableBodyHTML (rows) {
      let i, j, k;
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
            cellVal = rows[i][this._columns[j].key];
          }
          if (typeof this._columns[j].titleFunc === 'function') {
            titleVal = this._columns[j].titleFunc(rows[i], this._columns[j]);
          } else {
            titleVal = rows[i][this._columns[j].key] || '';
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
      let dataTable = document.querySelectorAll(DATA_TABLE_SELECTOR);
      for (i = 0; i < rowsDOM.length; i++) {
        rowsDOM[i].removeEventListener('click', this.handleRowClick);
      }
      dataTable.removeChildren(rowsDOM);
      dataTable.insertAdjacentHTML('beforeend', bodyHTML);
      rowsDOM = document.querySelectorAll(ROW_SELECTOR);
      for (i = 0; i < rowsDOM.length; i++) {
        rowsDOM[i].addEventListener('click', this.handleRowClick);
      }
    }

    _buildFullBody () {
      let i, rowsDOM, headerCellsDOM;
      let html = '<div class="data-table">';
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
  }

  return DataTable;
})();

export default DataTable;
