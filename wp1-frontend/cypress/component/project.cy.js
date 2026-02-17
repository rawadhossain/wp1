/// <reference types="Cypress" />

import ProjectPage from '../../src/components/ProjectPage.vue';

describe('ProjectPage Component', () => {
  const mockTableData = {
    table_data: {
      title: 'Aesthetics articles by quality and importance',
      total_cols: 7,
      is_single_col: false,
      ordered_cols: ['Top', 'High', 'Mid', 'Low', 'NA', '???'],
      ordered_rows: ['GA', 'B', 'C', 'Start', 'Stub', 'List', 'Category', 'Disambig', 'File', 'Project', 'Redirect', 'Template', 'Other', 'Assessed'],
      col_labels: {
        'Top': 'Top',
        'High': 'High',
        'Mid': 'Mid',
        'Low': 'Low',
        'NA': 'NA',
        '???': '???',
      },
      row_labels: {
        'GA': { text: 'GA', href: null },
        'B': { text: 'B', href: null },
        'C': { text: 'C', href: null },
        'Start': { text: 'Start', href: null },
        'Stub': { text: 'Stub', href: null },
        'List': { text: 'List', href: null },
        'Category': { text: 'Category', href: null },
        'Disambig': { text: 'Disambig', href: null },
        'File': { text: 'File', href: null },
        'Project': { text: 'Project', href: null },
        'Redirect': { text: 'Redirect', href: null },
        'Template': { text: 'Template', href: null },
        'Other': { text: 'Other', href: null },
        'Assessed': { text: 'Assessed', href: null },
      },
      data: {
        'GA': { 'Top': 5, 'High': 3, 'Mid': 2, 'Low': 1, 'NA': 0, '???': 0 },
        'B': { 'Top': 10, 'High': 8, 'Mid': 6, 'Low': 4, 'NA': 2, '???': 1 },
        'C': { 'Top': 15, 'High': 12, 'Mid': 10, 'Low': 8, 'NA': 5, '???': 2 },
        'Start': { 'Top': 20, 'High': 18, 'Mid': 15, 'Low': 12, 'NA': 8, '???': 3 },
        'Stub': { 'Top': 25, 'High': 22, 'Mid': 18, 'Low': 15, 'NA': 10, '???': 5 },
        'List': { 'Top': 2, 'High': 1, 'Mid': 1, 'Low': 0, 'NA': 0, '???': 0 },
        'Category': { 'Top': 0, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 1, '???': 0 },
        'Disambig': { 'Top': 0, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 0, '???': 0 },
        'File': { 'Top': 0, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 0, '???': 0 },
        'Project': { 'Top': 1, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 0, '???': 0 },
        'Redirect': { 'Top': 0, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 0, '???': 0 },
        'Template': { 'Top': 0, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 0, '???': 0 },
        'Other': { 'Top': 0, 'High': 0, 'Mid': 0, 'Low': 0, 'NA': 0, '???': 0 },
        'Assessed': { 'Top': 78, 'High': 64, 'Mid': 52, 'Low': 40, 'NA': 26, '???': 11 },
      },
      row_totals: {
        'GA': 11, 'B': 31, 'C': 52, 'Start': 76, 'Stub': 95,
        'List': 4, 'Category': 1, 'Disambig': 0, 'File': 0,
        'Project': 1, 'Redirect': 0, 'Template': 0, 'Other': 0, 'Assessed': 271,
      },
      col_totals: { 'Top': 78, 'High': 64, 'Mid': 52, 'Low': 40, 'NA': 26, '???': 11 },
      total: 271,
      timestamp: 1700000000,
    },
  };

  beforeEach(() => {
    // Mock the projects API endpoint for autocomplete
    cy.intercept('**/v1/projects/', {
      body: [
        { name: 'Aesthetics' },
        { name: 'Alien' },
        { name: 'Water' },
      ],
    }).as('projects');

    // Mock the project table API endpoint
    cy.intercept('**/v1/projects/Aesthetics/table', {
      body: mockTableData,
    }).as('aestheticsTable');
  });

  it('displays row and column labels in project-table', () => {
    cy.mount(ProjectPage, {
      route: '/project/Aesthetics',
      routes: [
        { path: '/project/:projectName', component: ProjectPage },
        { path: '/project/:projectName/articles', component: { template: '<div>Articles</div>' } },
      ],
    });

    // Wait for the table data to load
    cy.wait('@aestheticsTable');

    const col_labels = ['Top', 'High', 'Mid', 'Low', 'NA', '???'];
    col_labels.forEach((label) => {
      cy.get('table').contains('th', label);
    });

    const row_labels = [
      'GA',
      'B',
      'C',
      'Start',
      'Stub',
      'List',
      'Category',
      'Disambig',
      'File',
      'Project',
      'Redirect',
      'Template',
      'Other',
      'Assessed',
    ];
    row_labels.forEach((label) => {
      cy.get('table').contains('tr', label);
    });
  });

  it('displays article counts in table cells', () => {
    cy.mount(ProjectPage, {
      route: '/project/Aesthetics',
      routes: [
        { path: '/project/:projectName', component: ProjectPage },
        { path: '/project/:projectName/articles', component: { template: '<div>Articles</div>' } },
      ],
    });

    // Wait for the table data to load
    cy.wait('@aestheticsTable');

    // Verify the table is visible and contains the title
    cy.get('table')
      .should('be.visible')
      .should('contain.text', 'Aesthetics articles by quality and importance');
  });
});
