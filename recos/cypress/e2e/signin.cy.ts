/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
  return false; 
});

describe('Sign In Page', () => {
  beforeEach(() => {

    cy.visit('/signin', { timeout: 10000 });
  });

  it('renders the Sign In form correctly', () => {
    cy.contains('Sign In to Recos', { timeout: 10000 }).should('be.visible');
    cy.get('input[name="email"]', { timeout: 10000 }).should('exist');
    cy.get('input[name="password"]', { timeout: 10000 }).should('exist');
    cy.get('button[type="submit"]', { timeout: 10000 }).should('contain.text', 'Sign In');
    cy.get('a').contains('Forgot Password?', { timeout: 10000 }).should('have.attr', 'href', '/authentication/forgot-password');
    cy.get('a').contains('Sign Up', { timeout: 10000 }).should('have.attr', 'href', '/signup');
  });

  it('allows user to toggle password visibility', () => {
    cy.get('input[name="password"]', { timeout: 10000 }).as('passwordInput');
    cy.get('button[aria-label="Show password"]', { timeout: 10000 }).click();
    cy.get('@passwordInput').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Hide password"]', { timeout: 10000 }).click();
    cy.get('@passwordInput').should('have.attr', 'type', 'password');
  });

  it('shows error on invalid login', () => {
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('input[name="email"]', { timeout: 10000 }).type('invalid@example.com');
    cy.get('input[name="password"]', { timeout: 10000 }).type('wrongpassword');
    cy.get('button[type="submit"]', { timeout: 10000 }).click();

    cy.wait('@loginRequest', { timeout: 10000 });
    cy.contains(/login failed|invalid credentials|error/i, { timeout: 10000 }).should('be.visible');
  });

  it('logs in successfully with valid credentials', () => {
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: { success: true }
    }).as('loginRequest');

    cy.get('input[name="email"]', { timeout: 10000 }).clear().type('valid-email@example.com'); 
    cy.get('input[name="password"]', { timeout: 10000 }).clear().type('validpassword'); 
    cy.get('button[type="submit"]', { timeout: 10000 }).click();

    cy.wait('@loginRequest', { timeout: 10000 });
    cy.contains(/successfully logged in|welcome|dashboard/i, { timeout: 10000 }).should('be.visible');
    cy.url({ timeout: 10000 }).should('include', '/authentication/odoo');
  });
});
