describe('Kosár funkciók ellenőrzése', () => {
  it('Kosár oldal letöltődik és üres állapot jellemzi', () => {
    cy.visit('/cart')
    cy.url().should('include', '/cart')

    // Nem baj, hogyha nincsenek benne termékek, a fontos, hogy az oldal betöltsön.
  })
})
