describe('Admin jogosultságok ellenőrzése', () => {

  it('Látogató (nem bejelentkezett) nem tudja megnyitni az Admin felületet', () => {
    // Ha be akarjuk írni az URL-be, hogy /admin
    cy.visit('/admin')

    // Mivel nincs bejelentkezve, vagy a jogosultsága nincs meg (is_staff = false)
    // a Vue Router (router.beforeEach) visszadobja a kezdőlapra.
    cy.url().should('not.include', '/admin')
    cy.url().should('eq', Cypress.config().baseUrl === null ? 'http://localhost:4173/' : Cypress.config().baseUrl + '/')
  })
})

