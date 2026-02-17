/// <reference types="Cypress" />

import ArticlePage from '../../src/components/ArticlePage.vue';

describe('ArticlePage Component', () => {
  const mockArticleData = {
    articles: [
      {
        article: 'Alien (film)',
        article_link: 'https://en.wikipedia.org/wiki/Alien_(film)',
        article_talk_link: 'https://en.wikipedia.org/wiki/Talk:Alien_(film)',
        article_history_link: 'https://en.wikipedia.org/wiki/Alien_(film)?action=history',
        article_talk: 'Talk:Alien_(film)',
        importance: 'Top-Class',
        importance_updated: '2024-01-15T00:00:00Z',
        quality: 'FA-Class',
        quality_updated: '2024-01-15T00:00:00Z',
      },
      {
        article: 'Aliens (film)',
        article_link: 'https://en.wikipedia.org/wiki/Aliens_(film)',
        article_talk_link: 'https://en.wikipedia.org/wiki/Talk:Aliens_(film)',
        article_history_link: 'https://en.wikipedia.org/wiki/Aliens_(film)?action=history',
        article_talk: 'Talk:Aliens_(film)',
        importance: 'Top-Class',
        importance_updated: '2024-01-15T00:00:00Z',
        quality: 'FA-Class',
        quality_updated: '2024-01-15T00:00:00Z',
      },
      {
        article: 'Predator (film)',
        article_link: 'https://en.wikipedia.org/wiki/Predator_(film)',
        article_talk_link: 'https://en.wikipedia.org/wiki/Talk:Predator_(film)',
        article_history_link: 'https://en.wikipedia.org/wiki/Predator_(film)?action=history',
        article_talk: 'Talk:Predator_(film)',
        importance: 'Top-Class',
        importance_updated: '2024-01-15T00:00:00Z',
        quality: 'B-Class',
        quality_updated: '2024-01-15T00:00:00Z',
      },
    ],
    pagination: {
      display: { start: 1, end: 3, num_rows: 100 },
      total: 3,
      total_pages: 1,
    },
  };

  const mockPredatorArticleData = {
    articles: [
      {
        article: 'Predator (film)',
        article_link: 'https://en.wikipedia.org/wiki/Predator_(film)',
        article_talk_link: 'https://en.wikipedia.org/wiki/Talk:Predator_(film)',
        article_history_link: 'https://en.wikipedia.org/wiki/Predator_(film)?action=history',
        article_talk: 'Talk:Predator_(film)',
        importance: 'Top-Class',
        importance_updated: '2024-01-15T00:00:00Z',
        quality: 'B-Class',
        quality_updated: '2024-01-15T00:00:00Z',
      },
      {
        article: 'Predator 2',
        article_link: 'https://en.wikipedia.org/wiki/Predator_2',
        article_talk_link: 'https://en.wikipedia.org/wiki/Talk:Predator_2',
        article_history_link: 'https://en.wikipedia.org/wiki/Predator_2?action=history',
        article_talk: 'Talk:Predator_2',
        importance: 'Mid-Class',
        importance_updated: '2024-01-15T00:00:00Z',
        quality: 'C-Class',
        quality_updated: '2024-01-15T00:00:00Z',
      },
    ],
    pagination: {
      display: { start: 1, end: 2, num_rows: 100 },
      total: 2,
      total_pages: 1,
    },
  };

  const mockCategoryLinks = {
    'Top-Class': { text: 'Top', href: null },
    'High-Class': { text: 'High', href: null },
    'Mid-Class': { text: 'Mid', href: null },
    'Low-Class': { text: 'Low', href: null },
    'FA-Class': { text: 'FA', href: null },
    'GA-Class': { text: 'GA', href: null },
    'B-Class': { text: 'B', href: null },
    'C-Class': { text: 'C', href: null },
    'Start-Class': { text: 'Start', href: null },
    'Stub-Class': { text: 'Stub', href: null },
  };

  const mockTopBArticleData = {
    articles: [
      {
        article: 'Predator (film)',
        article_link: 'https://en.wikipedia.org/wiki/Predator_(film)',
        article_talk_link: 'https://en.wikipedia.org/wiki/Talk:Predator_(film)',
        article_history_link: 'https://en.wikipedia.org/wiki/Predator_(film)?action=history',
        article_talk: 'Talk:Predator_(film)',
        importance: 'Top-Class',
        importance_updated: '2024-01-15T00:00:00Z',
        quality: 'B-Class',
        quality_updated: '2024-01-15T00:00:00Z',
      },
    ],
    pagination: {
      display: { start: 1, end: 1, num_rows: 100 },
      total: 1,
      total_pages: 1,
    },
  };

  beforeEach(() => {
    // Mock project exists check
    cy.intercept('GET', '**/v1/projects/Alien', {
      statusCode: 200,
      body: { name: 'Alien' },
    }).as('projectCheck');

    // Mock category links
    cy.intercept('GET', '**/v1/projects/Alien/category_links', {
      body: mockCategoryLinks,
    }).as('categoryLinks');

    // Default articles endpoint
    cy.intercept('GET', '**/v1/projects/Alien/articles', {
      body: mockArticleData,
    }).as('articles');

    // Filtered by article name
    cy.intercept('GET', '**/v1/projects/Alien/articles?articlePattern=Predator', {
      body: mockPredatorArticleData,
    }).as('predatorArticles');

    // Pagination endpoint
    cy.intercept('GET', '**/v1/projects/Alien/articles?page=2&numRows=50', {
      body: {
        articles: Array(50).fill(null).map((_, i) => ({
          article: `Article ${51 + i}`,
          article_link: `https://en.wikipedia.org/wiki/Article_${51 + i}`,
          article_talk_link: `https://en.wikipedia.org/wiki/Talk:Article_${51 + i}`,
          article_history_link: `https://en.wikipedia.org/wiki/Article_${51 + i}?action=history`,
          article_talk: `Talk:Article_${51 + i}`,
          importance: 'Top-Class',
          importance_updated: '2024-01-15T00:00:00Z',
          quality: 'B-Class',
          quality_updated: '2024-01-15T00:00:00Z',
        })),
        pagination: {
          display: { start: 51, end: 100, num_rows: 50 },
          total: 200,
          total_pages: 4,
        },
      },
    }).as('paginatedArticles');

    // Quality/Importance filter
    cy.intercept('GET', '**/v1/projects/Alien/articles?importance=Top-Class&quality=B-Class', {
      body: mockTopBArticleData,
    }).as('topBArticles');

    // Random article endpoint
    cy.intercept('GET', '**/v1/projects/Alien/articles/random?quality=B-Class&importance=Top-Class', {
      statusCode: 200,
      body: JSON.stringify('https://en.wikipedia.org/w/index.php?title=Predator%20%28film%29'),
    }).as('randomTopBArticle');
  });

  it('filters by article name', () => {
    cy.mount(ArticlePage, {
      route: '/project/Alien/articles',
      routes: [
        { path: '/project/:projectName/articles', component: ArticlePage, props: (route) => ({ currentProject: route.params.projectName }) },
        { path: '/project/:projectName', component: { template: '<div>Project</div>' } },
      ],
      propsData: {
        currentProject: 'Alien',
      },
    });

    cy.wait('@articles');

    cy.contains('a', 'Filter by article name').click();

    cy.get('input').eq(2).type('Predator');
    cy.get('#updateName').click();

    // Don't continue until the table has been updated
    cy.wait('@predatorArticles');

    // Verify only Predator articles are shown
    cy.get('table')
      .find('tr')
      .each(($el) => {
        cy.wrap($el).should('contain.text', 'Predator');
      });
  });

  describe('custom pagination', () => {
    it('shows 50 rows in article-table', () => {
      cy.mount(ArticlePage, {
        route: '/project/Alien/articles',
        routes: [
          { path: '/project/:projectName/articles', component: ArticlePage, props: (route) => ({ currentProject: route.params.projectName }) },
          { path: '/project/:projectName', component: { template: '<div>Project</div>' } },
        ],
        propsData: {
          currentProject: 'Alien',
        },
      });

      cy.wait('@articles');

      cy.contains('Custom pagination').click();

      cy.get('input').eq(0).clear().type('50');
      cy.get('input').eq(1).clear().type('2');

      cy.get('#updatePagination').click();

      cy.wait('@paginatedArticles');

      // Verify first row shows article 51
      cy.get('tr').eq(0).find('td').eq(0).should('have.text', '51');

      // Verify we have 50 rows
      cy.get('tr').should('have.length', 50);
    });
  });

  describe('Select Quality/Importance', () => {
    it('displays articles with selected quality and importance', () => {
      cy.mount(ArticlePage, {
        route: '/project/Alien/articles',
        routes: [
          { path: '/project/:projectName/articles', component: ArticlePage, props: (route) => ({ currentProject: route.params.projectName }) },
          { path: '/project/:projectName', component: { template: '<div>Project</div>' } },
        ],
        propsData: {
          currentProject: 'Alien',
        },
      });

      cy.wait('@articles');

      cy.contains('Select Quality/Importance').click();

      cy.get('.custom-select').eq(0).select('B');
      cy.get('.custom-select').eq(1).select('Top');

      cy.get('#updateRating').click();

      cy.wait('@topBArticles');

      // Verify articles have Top importance and B quality
      cy.get('table')
        .find('tr')
        .each(($el) => {
          cy.wrap($el).should('contain.text', 'Top');
          cy.wrap($el).should('contain.text', 'B');
        });
    });

    it('opens a random article with selected quality and importance', () => {
      cy.mount(ArticlePage, {
        route: '/project/Alien/articles',
        routes: [
          { path: '/project/:projectName/articles', component: ArticlePage, props: (route) => ({ currentProject: route.params.projectName }) },
          { path: '/project/:projectName', component: { template: '<div>Project</div>' } },
        ],
        propsData: {
          currentProject: 'Alien',
        },
      });

      cy.wait('@articles');

      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('Select Quality/Importance').click();

      cy.get('.custom-select').eq(0).select('B');
      cy.get('.custom-select').eq(1).select('Top');

      cy.get('#randomArticle').click();

      cy.wait('@randomTopBArticle').then((interception) => {
        const randomArticleLink = JSON.parse(interception.response.body);
        cy.get('@windowOpen').should('be.calledWith', randomArticleLink);
      });
    });
  });
});
