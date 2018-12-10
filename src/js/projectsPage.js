import backendAPI from './backendAPI.js';
import SideMenu from './components/SideMenu.js';
import DataTable from './components/DataTable.js';
import router from './router.js';
import userData from './utils/userData.js';

const projectsPage = (function () {
  'use strict';

  const PROJECT_STATUSES = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    SUBMITTED: 'submitted',
    SHARED: 'shared'
  };

  class ProjectsPage {
    constructor () {
      this._model = {

      };
      this.sideMenuComponent = undefined;
      this.dataTable = undefined;
      window.onload = () => this.init();
    }

    init () {
      router.init();
      if (!backendAPI.isAuthTokenPresent()) {
        if (router.pages.LOGIN !== '') {
          router.navigate(router.pages.LOGIN, true);
        } else {
          router.navigate('../', true);
        }
        return;
      }
      this.sideMenuComponent = new SideMenu();
      this.bindEventListeners();
      backendAPI.getProjects()
        .then(resp => {
          // let resp = [];
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
          //     concepts: (Math.random() * 200) | 0,
          //     context: 'AACT, AGTA',
          //     entities: (Math.random() * 200) | 0,
          //     submittedBy: {
          //       email: emails[k],
          //       fullName: submitters[k]
          //     },
          //     submissionDate: new Date().getTime() + ((Math.random() * 1000) | 0)
          //   }
          //   resp.push(p);
          // }
          console.log('projects', resp);
          this.dataTable = new DataTable({
            tableContainerSelector: '.content-container',
            columns: [
              {
                name: 'Project Name',
                key: 'name',
                cellClass: 'data-table__cell--bold',
                // sortingFunc: (columnCfg, order) => {
                //   backendAPI.getProjects({
                //     field: columnCfg.key,
                //     order
                //   }).then(resp => {
                //     this.dataTable.data = resp;
                //   });
                // }
              },
              {
                name: 'Status',
                key: 'status',
                cellClass: 'data-table__cell--bold',
                insertionFunc: (row, columnCfg) => {
                  let user = userData.getUser();
                  let status = row.status;
                  if (row.submittedBy.email.toLowerCase() !== user.email.toLowerCase()) {
                    status = PROJECT_STATUSES.SHARED;
                  }
                  return `<span class="project-status project-status--${status}">${status}</span>`;
                }
              },
              {
                name: 'Concepts',
                key: 'concepts'
              },
              {
                name: 'Context',
                key: 'context'
              },
              {
                name: 'Entities',
                key: 'entities',
              },
              {
                name: 'Submitted By',
                titleFunc: (row, columnCfg) => {
                  return row.submittedBy.fullName || row.submittedBy.email;
                },
                insertionFunc: (row, columnCfg) => {
                  return row.submittedBy.fullName || row.submittedBy.email;
                }
              },
              {
                name: 'Submission Date',
                key: 'submissionDate',
                insertionFunc: (row, columnCfg) => {
                  return row.submissionDate;
                }
              },
              {
                name: 'Actions',
                sortable: false,
                cellClass: 'data-table__cell--max-width-264',
                insertionFunc: (row, columnCfg) => {
                  let user = userData.getUser();
                  let cellHTML =
                    `<div class="actions-wrapper"><span class="button button--tag button--blue">Entities</span>`;
                  if (row.submittedBy.email.toLowerCase() === user.email.toLowerCase()) {
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
                  cellHTML += '</div>'
                  return cellHTML;
                }
              }
            ],
            data: resp
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    bindEventListeners () {

    }
  }

  return new ProjectsPage();
})();

export default projectsPage;
