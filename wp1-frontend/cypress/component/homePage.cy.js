/// <reference types="Cypress" />

import IndexPage from '../../src/components/IndexPage.vue';

describe('IndexPage Component', () => {
  beforeEach(() => {
    // Mock the projects API endpoint
    cy.intercept('**/v1/projects/', {
      body: [
        { name: 'Alien' },
        { name: 'Water' },
        { name: 'Watercraft' },
        { name: 'Aesthetics' },
      ],
    }).as('projects');
  });

  it('successfully loads', () => {
    cy.mount(IndexPage, {
      route: '/',
      routes: [
        { path: '/', component: IndexPage },
        { path: '/project/:projectName', component: { template: '<div>Project</div>' } },
      ],
    });

    cy.get('.search').should('be.visible');
  });

  it('autocompletes for Water', () => {
    cy.mount(IndexPage, {
      route: '/',
      routes: [
        { path: '/', component: IndexPage },
        { path: '/project/:projectName', component: { template: '<div>Project</div>' } },
      ],
    });

    cy.get('.search').type('Water');

    cy.get('.results').should('be.visible');
    cy.get('.results').children('li').eq(1).should('contain.text', 'Water');
  });

  it('navigates to project page when project is selected', () => {
    cy.mount(IndexPage, {
      route: '/',
      routes: [
        { path: '/', component: IndexPage },
        { path: '/project/:projectName', component: { template: '<div id="project-page">Project Page</div>' } },
      ],
    });

    cy.get('.search').type('Alien');

    cy.get('.results').should('be.visible');
    cy.get('.results')
      .children('li')
      .eq(0)
      .should('contain.text', 'Alien')
      .click();

    // Verify navigation occurred (router replaced path)
    cy.url().should('include', 'project/Alien');
  });
});
