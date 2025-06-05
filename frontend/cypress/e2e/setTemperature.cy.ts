/// <reference types="cypress" />

describe('Data Flow Testing - Setare temperatură', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002');
  });

  it('Setează intervalul de temperatură, simulează temperaturi și verifică starea alertei', () => {
    cy.get('[data-testid=input-min]').clear().type('22');
    cy.get('[data-testid=input-max]').clear().type('24');
    cy.get('[data-testid=btn-save]').click();

    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('td').eq(2).then(($cell) => {
        const text = $cell.text().trim();
        if (text === 'Avertisment') {
          expect(text).to.equal('Avertisment');  // asta e corect
        } else {
          expect(text).to.equal('OK');
        }
      });
    });

    cy.get('[data-testid=btn-temp-24]').click();

    cy.get('[data-testid=alert-status]').should('contain.text', 'Activă');
    cy.get('[data-testid=fan-status]').should('contain.text', 'ON');

    cy.get('[data-testid=btn-temp-27]').click();
    cy.get('[data-testid=alert-status]').should('contain.text', 'Inactivă');
    cy.get('[data-testid=fan-status]').should('contain.text', 'OFF');
  });
});
