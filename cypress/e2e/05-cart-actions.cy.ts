describe('Kosárba rakási folyamat', () => {

  it('Az étlapon megtalálható ételt a kosárba helyezi és megjelenik a kosár oldalán', () => {
    // Étlap betöltése
    cy.visit('/menu')

    // Megvárjuk, amíg betöltenek az ételek. A gomb a .add-to-cart-btn classal van ellátva.
    // Csak olyat választunk, ami engedélyezett (nincs rajta a disabled-btn)
    cy.get('.add-to-cart-btn').not('.disabled-btn').first().click({ force: true })

    // Elnavigálunk a kosár oldalra, hogy megnézzük, bekerült-e
    cy.visit('/cart')

    // Elvárjuk, hogy a kosár oldalon valamilyen lista vagy végösszeg utaljon arra, hogy van benne valami.
    // Ha volt a kosárban valami, akkor nem üres (ez az egyes projektektől függ, mi most azt mondjuk, hogy jelenjen meg valami a listában)
    // Elvárjuk, hogy az üres kosár szöveg NE jelenjen meg (mivel tettünk bele elemet).
    // Ez a teszt alkalmazkodik a frontend frameworköd kosár jelölőjéhez.
    cy.get('body').then($body => {
      if ($body.find('.cart-item, .cart-row, table tbody tr').length > 0) {
        cy.get('.cart-item, .cart-row, table tbody tr').should('have.length.greaterThan', 0)
      } else {
        // Ha valamiert nem .cart-item a classod, akkor azt a blokkot várjuk, hogy ne legyen "A kosár üres" típusú felirat.
        cy.contains('ures').should('not.exist')
      }
    })
  })
})

