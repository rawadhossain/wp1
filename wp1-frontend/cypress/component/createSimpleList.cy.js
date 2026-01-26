/// <reference types="Cypress" />

import SimpleBuilder from '../../src/components/SimpleBuilder.vue';

describe('SimpleBuilder Component - Create Mode', () => {
  describe('when the user is logged in', () => {
    beforeEach(() => {
      cy.intercept('**/v1/sites/', { fixture: 'sites.json' }).as('sites');
      cy.intercept('**/v1/oauth/identify', { fixture: 'identity.json' }).as('identity');
      
      cy.mount(SimpleBuilder, {
        route: '/selections/simple',
        routes: [
          { path: '/selections/simple', component: SimpleBuilder },
          { path: '/selections/simple/:builder_id', component: SimpleBuilder },
          { path: '/selections/user', component: { template: '<div id="user-page">User Page</div>' } },
        ],
        rootData: { isLoggedIn: true },
      });
    });

    it('successfully loads', () => {
      cy.get('select').should('exist');
    });

    it('displays wiki projects', () => {
      cy.get('select').contains('aa.wikipedia.org');
      cy.get('select').contains('en.wiktionary.org');
      cy.get('select').contains('en.wikipedia.org');
    });

    it('validates list name on clicking save', () => {
      cy.get('#saveListButton').click();
      cy.get('#listName').contains('Please provide a valid list name');
    });

    it('validates textbox on clicking save', () => {
      cy.get('#saveListButton').click();
      cy.get('#listName > .invalid-feedback').should('be.visible');
      cy.get('#items > .invalid-feedback').should('be.visible');
    });

    it('validates list name on losing focus', () => {
      cy.get('#listName > .form-control').click();
      cy.get('#items > .form-control').click();
      cy.get('#listName > .invalid-feedback').should('be.visible');
    });

    it('validates textbox on losing focus', () => {
      cy.get('#items > .form-control').click();
      cy.get('#listName > .form-control').click();
      cy.get('#items > .invalid-feedback').should('be.visible');
    });

    it('displays a textbox with invalid article names', () => {
      cy.get('#listName > .form-control').click().type('List Name');
      cy.get('#items > .form-control')
        .click()
        .type('Eiffel_Tower\nStatue of#Liberty');
      cy.intercept('**/v1/builders/', { fixture: 'save_list_failure.json' }).as('save');
      cy.get('#saveListButton').click();

      cy.get('#items > .invalid-feedback').should('be.visible');
      cy.get('#listName > .invalid-feedback').should('not.be.visible');

      cy.get('#items > .form-control').should(
        'have.value',
        'Eiffel_Tower\nStatue of#Liberty'
      );
      cy.get('#invalid_articles').contains(
        'The list contained the following invalid characters: #'
      );
      cy.get('#invalid_articles > .form-control').should(
        'have.value',
        'Statue_of#Liberty'
      );
    });

    it('saves successfully after fixing invalid names', () => {
      cy.intercept('**/v1/builders/', (req) => {
        if (req.body.params.list.length > 1) {
          // First request has two items, second is invalid.
          req.reply({
            statusCode: 200,
            fixture: 'save_list_failure.json',
          });
        } else {
          // Second request has only one item and is valid.
          req.reply({
            statusCode: 200,
            fixture: 'save_list_success.json',
          });
        }
      }).as('save');

      cy.get('#listName > .form-control').click().type('List Name');
      cy.get('#items > .form-control')
        .click()
        .type('Eiffel_Tower\nStatue of#Liberty');
      cy.get('#saveListButton').click();

      cy.get('#items > .form-control').click().clear().type('Eiffel_Tower');

      cy.get('#saveListButton').click();
      cy.url().should('include', '/selections/user');
    });

    describe('when save button clicked', () => {
      beforeEach(() => {
        cy.intercept('**/v1/builders/', (req) => {
          req.continue(() => {
            return new Promise((resolve) => {
              setTimeout(resolve, 4000);
            });
          });
        }).as('slowSave');
      });

      it('shows spinner', () => {
        cy.get('#listName > .form-control').click().type('List Name');
        cy.get('#items > .form-control').click().type('Eiffel_Tower');
        cy.get('#saveListButton').click();
        cy.get('#saveLoader').should('be.visible');
      });

      it('disables save button', () => {
        cy.get('#listName > .form-control').click().type('List Name');
        cy.get('#items > .form-control').click().type('Eiffel_Tower');
        cy.get('#saveListButton').click();
        cy.get('#saveListButton').should('have.attr', 'disabled');
      });
    });

    it('redirects on saving valid article names', () => {
      cy.get('#listName > .form-control').click().type('List Name');
      cy.get('#items > .form-control')
        .click()
        .type('Eiffel_Tower\nStatue of Liberty');
      cy.intercept('**/v1/builders/', { fixture: 'save_list_success.json' }).as('save');
      cy.get('#saveListButton').click();
      cy.url().should('include', '/selections/user');
    });
  });

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      cy.intercept('**/v1/sites/', { fixture: 'sites.json' }).as('sites');
    });

    it('opens login page', () => {
      cy.mount(SimpleBuilder, {
        route: '/selections/simple',
        routes: [
          { path: '/selections/simple', component: SimpleBuilder },
          { path: '/selections/user', component: { template: '<div>User Page</div>' } },
        ],
        rootData: { isLoggedIn: false },
      });
      
      cy.contains('Please Log In To Continue');
      cy.get('.pt-2 > .btn');
    });
  });
});
