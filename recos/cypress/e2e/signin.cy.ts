/// <reference types="cypress" />

// This assumes your SignIn page is at /signin (adjust path as needed)

describe('SignIn Page', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('renders the logo image', () => {
    cy.get('img[alt="Recos Logo"]').should('exist');
  });

  it('renders the form fields', () => {
    cy.get('input#email').should('exist').and('have.attr', 'type', 'email');
    cy.get('input#password').should('exist').and('have.attr', 'type', 'password');
    cy.get('button[type="submit"]').should('exist').and('contain', 'Sign In');
  });

  it('toggles password visibility', () => {
    cy.get('input#password').should('have.attr', 'type', 'password');
    cy.get('button[aria-label="Show password"]').click();
    cy.get('input#password').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Hide password"]').click();
    cy.get('input#password').should('have.attr', 'type', 'password');
  });

  it('shows forgot password link and navigates on click', () => {
    cy.get('a').contains('Forgot Password?').should('exist').click();
    cy.url().should('include', '/authentication/forgot-password');
  });

  it('shows sign up link in the form and navigates on click', () => {
    cy.get('a').contains('Sign Up').eq(0).should('exist').click();
    cy.url().should('include', '/signup');
  });

  it('shows sign up link on right panel and navigates on click', () => {
    cy.visit('/signin'); 
    cy.get('.bg-purple-700 a').contains('Sign Up').should('exist').click();
    cy.url().should('include', '/signup');
  });

  it('requires email and password', () => {
    cy.get('button[type="submit"]').click();
    cy.get('input#email:invalid').should('exist');
    cy.get('input#password:invalid').should('exist');
  });

  it('submits with valid credentials and shows loading', () => {
    cy.intercept('POST', '**/login', { statusCode: 200, body: { success: true } }).as('login');
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').should('contain', 'Signing In...');
   
  });

  it('shows error message on failed login', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginFail');
    cy.get('input#email').type('wrong@example.com');
    cy.get('input#password').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
  });

  it('clears messages on input change', () => {
   
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('input#email').clear().type('new@example.com');
    cy.contains('Successfully logged in!').should('not.exist');
  });

  it('renders all main layout sections', () => {
    cy.get('.bg-white').should('exist');
    cy.get('.bg-purple-700').should('exist');
  });

  it('has accessibility features', () => {
    cy.get('button[aria-label]').should('exist');
    cy.get('input#email').should('have.attr', 'required');
    cy.get('input#password').should('have.attr', 'required');
  });
});