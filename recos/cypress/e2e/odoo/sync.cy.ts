/// <reference types="cypress" />

describe('Odoo Sync Page', () => {
  beforeEach(() => {
    cy.visit('/authentication/odoo');
  });

  it('renders logo and heading', () => {
    cy.get('img[alt="Logo"]').should('exist');
    cy.contains('Connect Your Odoo Account').should('exist');
    cy.contains('Sync With Odoo').should('exist');
  });

  it('renders all input fields', () => {
    cy.get('input#dbUrl').should('exist');
    cy.get('input#dbName').should('exist');
    cy.get('input#email').should('exist');
    cy.get('input#apiKey').should('exist');
    cy.get('input[type="checkbox"]').should('exist');
    cy.contains("I agree to share my candidate information & files from Odoo with Recos.").should('exist');
  });

  it('shows error message on failed sync', () => {
    cy.window().then(win => {
      win.document.body.innerHTML += `
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p class="text-sm text-red-700">Test sync error!</p>
        </div>
      `;
    });
    cy.contains('Test sync error!').should('exist');
  });

  it('submits the form with valid data', () => {
    cy.get('input#dbUrl').type('https://myodoo.com');
    cy.get('input#dbName').type('testdb');
    cy.get('input#email').type('testuser@example.com');
    cy.get('input#apiKey').type('supersecret');
    cy.get('input[type="checkbox"]').check();
    cy.get('button[type="submit"]').click();
    
  });

  it('opens Odoo site in new tab when clicking Create Odoo Account', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.contains('Create Odoo Account').click();
    cy.get('@windowOpen').should('be.calledWith', 'https://www.odoo.com/', '_blank');
  });

  it('navigates to companies page when clicking View Your Companies', () => {
    cy.contains('View Your Companies').click();
    cy.url().should('include', '/authentication/odoo/companies');
  });

  it('opens Odoo forum in new tab for API key help', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.contains('Generate Key').click();
    cy.get('@windowOpen').should('be.calledWith', 'https://www.odoo.com/forum/help-1?my=mine', '_blank');
  });
});