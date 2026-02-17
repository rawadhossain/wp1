/// <reference types="Cypress" />

import SimpleBuilder from '../../src/components/SimpleBuilder.vue';

describe('SimpleBuilder Component - Update Mode', () => {
  describe('when the user is logged in', () => {
    beforeEach(() => {
      cy.intercept('**/v1/sites/', { fixture: 'sites.json' }).as('sites');
      cy.intercept('**/v1/oauth/identify', { fixture: 'identity.json' }).as('identity');
    });

    describe('and the builder is found', () => {
      beforeEach(() => {
        cy.intercept('GET', '**/v1/builders/1', { fixture: 'simple_builder.json' }).as('builder');
        
        cy.mount(SimpleBuilder, {
          route: '/selections/simple/1',
          routes: [
            { path: '/selections/simple', component: SimpleBuilder },
            { path: '/selections/simple/:builder_id', component: SimpleBuilder },
            { path: '/selections/user', component: { template: '<div id="user-page">User Page</div>' } },
          ],
          rootData: { isLoggedIn: true },
        });
        
        cy.wait('@sites');
        cy.wait('@identity');
        cy.wait('@builder');
      });

      it('successfully loads', () => {
        cy.get('select').should('exist');
      });

      it('displays wiki projects', () => {
        cy.get('select').contains('aa.wikipedia.org');
        cy.get('select').contains('en.wiktionary.org');
        cy.get('select').contains('en.wikipedia.org');
      });

      it('displays builder information', () => {
        cy.get('#listName > .form-control').should('have.value', 'Builder 1');
        cy.get('#items > .form-control').should(
          'have.value',
          'Eiffel_Tower\nStatue_of_Liberty'
        );
        cy.get('#project > select').should('have.value', 'en.wiktionary.org');
      });

      it('does not show invalid list items', () => {
        cy.get('#items > .invalid-feedback').should('not.be.visible');
      });

      it('does not show invalid list name', () => {
        cy.get('#listName > .invalid-feedback').should('not.be.visible');
      });

      it('displays a textbox with invalid article names', () => {
        cy.get('#items > .form-control').click().type('\nStatue of#Liberty');
        cy.intercept('POST', '**/v1/builders/1', { fixture: 'save_list_failure.json' }).as('save');
        cy.get('#updateListButton').click();
        cy.get('#items > .form-control').should(
          'have.value',
          'Eiffel_Tower\nStatue_of_Liberty\nStatue of#Liberty'
        );
        cy.get('#invalid_articles').contains(
          'The list contained the following invalid characters: #'
        );
        cy.get('#invalid_articles > .form-control').should(
          'have.value',
          'Statue_of#Liberty'
        );
      });

      it('redirects on saving valid article names', () => {
        cy.intercept('POST', '**/v1/builders/1', { fixture: 'save_list_success.json' }).as('save');
        cy.get('#updateListButton').click();
        cy.url().should('include', '/selections/user');
      });

      describe('when update button clicked', () => {
        beforeEach(() => {
          cy.intercept('POST', '**/v1/builders/1', (req) => {
            req.continue(() => {
              return new Promise((resolve) => {
                setTimeout(resolve, 4000);
              });
            });
          }).as('slowSave');
        });

        it('shows spinner', () => {
          cy.get('#updateListButton').click();
          cy.get('#updateLoader').should('be.visible');
        });

        it('disables update button', () => {
          cy.get('#updateListButton').click();
          cy.get('#updateListButton').should('have.attr', 'disabled');
        });
      });
    });

    describe('and the builder has fatal errors', () => {
      beforeEach(() => {
        cy.intercept('GET', '**/v1/builders/1', { fixture: 'simple_builder_fatal_error.json' }).as('builder');
        
        cy.mount(SimpleBuilder, {
          route: '/selections/simple/1',
          routes: [
            { path: '/selections/simple/:builder_id', component: SimpleBuilder },
            { path: '/selections/user', component: { template: '<div>User Page</div>' } },
          ],
          rootData: { isLoggedIn: true },
        });
      });

      it('displays the error div', () => {
        cy.get('.materialize-error').should('be.visible');
      });

      it('disables the retry button', () => {
        cy.get('.materialize-error .btn').should('have.attr', 'disabled');
      });
    });

    describe('and the builder has retryable errors', () => {
      beforeEach(() => {
        cy.intercept('GET', '**/v1/builders/1', { fixture: 'simple_builder_retryable_error.json' }).as('builder');
        
        cy.mount(SimpleBuilder, {
          route: '/selections/simple/1',
          routes: [
            { path: '/selections/simple/:builder_id', component: SimpleBuilder },
            { path: '/selections/user', component: { template: '<div>User Page</div>' } },
          ],
          rootData: { isLoggedIn: true },
        });
      });

      it('displays the error div', () => {
        cy.get('.materialize-error').should('be.visible');
      });

      it('enables the retry button', () => {
        cy.get('.materialize-error .btn').should('not.have.attr', 'disabled');
      });
    });

    describe('and the builder is not found', () => {
      beforeEach(() => {
        cy.intercept('GET', '**/v1/builders/1', {
          statusCode: 404,
          body: '404 NOT FOUND',
        }).as('builder');
        
        cy.mount(SimpleBuilder, {
          route: '/selections/simple/1',
          routes: [
            { path: '/selections/simple/:builder_id', component: SimpleBuilder },
            { path: '/selections/user', component: { template: '<div>User Page</div>' } },
          ],
          rootData: { isLoggedIn: true },
        });
      });

      it('displays the 404 text', () => {
        cy.get('#404').should('be.visible');
      });
    });
  });

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      cy.intercept('**/v1/sites/', { fixture: 'sites.json' }).as('sites');
    });

    it('opens login page', () => {
      cy.mount(SimpleBuilder, {
        route: '/selections/simple/1',
        routes: [
          { path: '/selections/simple/:builder_id', component: SimpleBuilder },
          { path: '/selections/user', component: { template: '<div>User Page</div>' } },
        ],
        rootData: { isLoggedIn: false },
      });
      
      cy.contains('Please Log In To Continue');
      cy.get('.pt-2 > .btn');
    });
  });
});
