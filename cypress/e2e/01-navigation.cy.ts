describe('Alapvető Navigációs Tesztek', () => {
  beforeEach(() => {
    // Alapértelmezett, indulás előtti lépés: betöltjük a kezdőlapot
    cy.visit('/')
  })

  it('Betölti a kezdőlapot rendben', () => {
    // Ellenőrizzük, hogy betöltött-e az oldal
    cy.url().should('eq', Cypress.config().baseUrl === null ? 'http://localhost:4173/' : Cypress.config().baseUrl + '/')
    // Opcionálisan ide jöhet majd egy cy.contains('Lorem ipsum') vagy egy konkrét kezdőlapi szöveg hivatkozás
  })

  it('Navigáció az Étlap (Menu) menüpontra', () => {
    // Itt feltételezzük, hogy az Étlap / Menu elérhető link formájában (/menu vagy hasonló)
    // Direkt url hívással teszteljük az oldal működését Routeren keresztül:
    cy.visit('/menu')
    cy.url().should('include', '/menu')
  })

  it('Navigáció a Rólunk (About) és Kapcsolat (Contact) oldalakra', () => {
    cy.visit('/about')
    cy.url().should('include', '/about')

    cy.visit('/contact')
    cy.url().should('include', '/contact')
  })
})

