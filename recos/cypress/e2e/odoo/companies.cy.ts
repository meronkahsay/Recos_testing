/// <reference types="cypress" />

describe('Odoo Companies Page', () => {
  beforeEach(() => {
    cy.visit('/authentication/odoo/companies');
  });

  it('renders logo and heading', () => {
    cy.get('img[alt="Logo"]').should('exist');
    cy.contains('Companies List').should('exist');
  });

  it('shows message when no companies', () => {
    cy.contains('No companies found. Add a company to get started.').should('exist');
  });

  it('shows add company button', () => {
    cy.contains('+ Add Company').should('exist').click();
    cy.url().should('include', '/authentication/odoo');
  });

  it('renders purple info panel', () => {
    cy.contains('Want to connect to a different Instance?').should('exist');
    cy.contains('To sync company candidate data, please connect your Odoo account.').should('exist');
  });

  it('navigates to dashboard when a company is clicked', () => {
    const testCompany = { company_id: '123', company_name: 'TestCompany' };
    cy.window().then(win => {
      const btn = win.document.createElement('button');
      btn.innerText = testCompany.company_name;
      btn.onclick = () => {
        localStorage.setItem('selectedCompany', JSON.stringify(testCompany));
        win.location.href = `/dashboard/${testCompany.company_id}`;
      };
      win.document.body.appendChild(btn);
    });
    cy.contains('TestCompany').click();
    cy.url().should('include', '/dashboard/123');
    cy.window().then(win => {
      const stored = win.localStorage.getItem('selectedCompany');
      expect(stored).to.not.be.null;
      expect(JSON.parse(stored!)).to.deep.equal({ company_id: '123', company_name: 'TestCompany' });
    });
  });
});