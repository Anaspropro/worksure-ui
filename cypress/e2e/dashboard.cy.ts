describe('Dashboard Role-Based Routing and Modals', () => {
  const clientEmail = 'test.client@worksure.dev';
  const artisanEmail = 'test.artisan@worksure.dev';
  const password = 'AdminPass123';

  it('should login as a Client and see the Client Dashboard', () => {
    cy.visit('/auth/login');
    cy.get('input#email').type(clientEmail);
    cy.get('input#password').type(password);
    cy.get('button[type="submit"]').click();

    // The middleware should redirect to /dashboard/client
    cy.url({ timeout: 30000 }).should('include', '/dashboard/client');
    cy.contains('Client Dashboard', { timeout: 20000 });
  });

  it('should login as an Artisan and see the Artisan Dashboard', () => {
    cy.wait(5000);
    cy.visit('/auth/login');
    cy.get('input#email').type(artisanEmail);
    cy.get('input#password').type(password);
    cy.get('button[type="submit"]').click();

    // The middleware should redirect to /dashboard/artisan
    cy.url({ timeout: 30000 }).should('include', '/dashboard/artisan');
    cy.contains('Artisan Dashboard', { timeout: 20000 });
  });

  it('should login as an Admin and see the Admin Dashboard', () => {
    cy.wait(5000);
    cy.visit('/auth/login');
    cy.get('input#email', { timeout: 10000 }).type('webwiz.admin@worksure.dev');
    cy.get('input#password').type('AdminPass123');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 30000 }).should('include', '/admin');
    cy.contains('Platform Overview', { timeout: 20000 });
  });
});
